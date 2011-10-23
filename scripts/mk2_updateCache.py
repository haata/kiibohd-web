#!/usr/bin/python2

try: 
  from xml.etree import ElementTree
except ImportError:  
  from elementtree import ElementTree
import gdata.spreadsheet.service
import gdata.service
import atom.service
import gdata.spreadsheet
import atom
import string
import sys

from MySQLdb import *
from sets import Set

# Connect to MySQL database
hostname='<your MySQL hostname>'
username='<MySQL access username r/w>'
password='<username password>'
dbname='<database name>'
db = connect( host=hostname, db=dbname, user=username, passwd=password)

# Connect to Google Docs database
gd_client = gdata.spreadsheet.service.SpreadsheetsService()
gd_client.email = '<GMail address>'
gd_client.password = '<password for GMail>'
gd_client.source = 'Kiibohd.com-DatabaseUpdate'
gd_client.ProgrammaticLogin()

# Get List of Worksheets
def PromptForSpreadsheet(gd_client):
  # Get the list of spreadsheets
  feed = gd_client.GetSpreadsheetsFeed()
  PrintFeed(feed)

def PrintFeed(feed):
  for i, entry in enumerate(feed.entry):

    if isinstance(feed, gdata.spreadsheet.SpreadsheetsCellsFeed):
      print '%s %s\n' % (entry.title.text, entry.content.text)
    elif isinstance(feed, gdata.spreadsheet.SpreadsheetsListFeed):
      print '%s %s %s' % (i, entry.title.text, entry.content.text)
      # Print this row's value for each column (the custom dictionary is
      # built from the gsx: elements in the entry.) See the description of
      # gsx elements in the protocol guide.
      print 'Contents:'
      for key in entry.custom:
        print '  %s: %s' % (key, entry.custom[key].text)
      print '\n',
    else:
      print '%s %s' % (i, entry.title.text)
      id_parts = entry.id.text.split('/')
      curr_key = id_parts[len(id_parts) - 1]
      print curr_key

def PromptForWorksheet(gd_client, key):
  # Get the list of worksheets
  feed = gd_client.GetWorksheetsFeed(key)
  PrintFeed(feed)


# Get list of tables from the MySQL database
def getTableList(database):
	outTable = []

	# Get cursor
	curs = db.cursor()

	# Select all tables
	curs.execute('SHOW TABLES')

	# Build list of tables to return
	for table in range(0,curs.rowcount):
		outTable.append( curs.fetchone()[0] )

	# Close the cursor
	curs.close()

	return outTable

# Get list of columns from the specified MySQL table
def getColumnList(database,table):
	outTable = []

	# Get cursor
	curs = db.cursor()

	# Select all tables
	curs.execute('SHOW COLUMNS FROM ' + table )

	# Build list of tables to return
	for table in range(0,curs.rowcount):
		outTable.append( curs.fetchone()[0] )

	# Close the cursor
	curs.close()

	return outTable

# Get list of worksheets from the Google Docs Spreadsheet database
def getWorksheetList(gd_client):
	outTable = []

	# Get the list of spreadsheets
	ss_feed = gd_client.GetSpreadsheetsFeed()

	# Go through list of spreadsheets for worksheets
	for ss_i,ss_entry in enumerate( ss_feed.entry ):
		ss_id_parts = ss_entry.id.text.split('/')
		ss_key = ss_id_parts[ len( ss_id_parts ) - 1 ]
		ws_feed = gd_client.GetWorksheetsFeed( ss_key )

		# Go through spreadsheets for key,name tuples
		for ws_i,ws_entry in enumerate( ws_feed.entry ):
			ws_id_parts = ws_entry.id.text.split('/')
			ws_key = ws_id_parts[ len( ws_id_parts ) - 1 ]

			# Append tuple to list
			outTable.append( (ss_key,ws_key,ws_entry.title.text) )

	return outTable

def getWorksheetColumnList(gd_client,spreadsheet_key,worksheet_key):
	outTable = []

	# Get list feed of worksheet
	l_entries = getWorksheetEntries(gd_client, spreadsheet_key, worksheet_key)

	# Iterate through list, looking for header of each column
	for l_i, l_entry in enumerate(l_entries):
		# Add each of headers to the outTable
		for key in l_entry.custom:
			outTable.append( key )

		# Only need one entry for the column list
		break

	return outTable

def getWorksheetEntries(gd_client,spreadsheet_key,worksheet_key):
	l_feed = gd_client.GetListFeed(spreadsheet_key, worksheet_key)

	return l_feed.entry
	

# Find the key tuples for the desired worksheet
def findWorksheetKeys(worksheet_list,name):
	for item in worksheet_list:
		# Match table name with worksheet name
		if item[2] == name:
			return (item[0], item[1])

	print "ERROR: Name not found -", name

# Using sets, find the items missing from the base_list
def missingItems( base_list, new_list ):
	base_set = set( base_list )
	new_set  = set( new_list )

	return list( new_set.difference( base_set.intersection( new_set ) ) )

# Add given list of columns to given MySQL table
def addColumnsToTable( db, table, column_list ):
	# Warn user if there are no items to add
	if ( len( column_list ) == 0 ):
		print "WARNING: No columns to add to", table
		return

	# Get cursor
	curs = db.cursor()

	# Add each of the new columns to the table
	sql_command = 'ALTER TABLE ' + table
	for item in column_list:
		sql_command += ' ADD COLUMN ' + item + ' varchar(500),'
	print sql_command
	curs.execute( sql_command[ 0:len(sql_command) - 1] )

	# Close the cursor
	curs.close()

# Remove unused columns from table
def removeColumnsFromTable( db, table, column_list ):
	# Warn user if there are no items to remove
	if ( len( column_list ) == 0 ):
		print "WARNING: No columns to remove from", table
		return

	# Get cursor
	curs = db.cursor()

	# Remove each of the given columns from the table
	sql_command = 'ALTER TABLE ' + table
	for item in column_list:
		sql_command += ' DROP COLUMN ' + item + ','
	print sql_command
	curs.execute( sql_command[ 0:len(sql_command) - 1] )

	# Close the cursor
	curs.close()


# Get elements of MySQL column
def getElements( db, table, column ):
	outTable = []

	# Get cursor
	curs = db.cursor()

	# Select all tables
	curs.execute( 'SELECT ' + column + ' FROM ' + table )

	# Build list of tables to return
	for table in range(0,curs.rowcount):
		outTable.append( curs.fetchone()[0] )

	# Close the cursor
	curs.close()

	return outTable

# Verify that the given row ID exists, and if not, add it
def verifyRow( db, table, id ):
	# Get cursor
	curs = db.cursor()

	# Select all tables
	sql_command = 'SELECT * FROM ' + table + ' WHERE id = "\'' + id + '\'"'
	curs.execute( sql_command )

	# If no row matches are found, add the row
	if ( curs.rowcount < 1 ):
		print "WARNING: New row into", table, "-", id, "|", curs.rowcount
		sql_command = 'INSERT INTO ' + table + ' SET id = "' + id + '"'
		curs.execute( sql_command )

	# Close the cursor
	curs.close()


# Update Row with given id, by the column,value tuple list
# XXX This function was a bitch... (encodings, safe-escaping, etc.) be careful when changing
def updateRow( db, table, id, value_list ):
	# Get cursor
	curs = db.cursor()

	# Update each of the column,value pairs to the row with the matching ID
	sql_params = []
	sql_command = unicode( 'UPDATE %s SET' % table, "utf-8" )
	for item in value_list:
		sql_params.append( item[1].encode("utf-8") )
		sql_command += unicode( ' %s = "' % item[0], "utf-8" ) + unicode('%s",', "utf-8" )
	sql_command = sql_command[ 0:len(sql_command) - 1 ] + unicode( ' WHERE id = "%s"' % id, "utf-8" )

	# Execute the command, with the parameters that need escaping
	curs.execute( sql_command.encode("utf-8"), sql_params )

	# Close the cursor
	curs.close()


# Get list of columns to add, as well as those to remove, and then update the columns by cross-reference
def updateSQLColumns( db, gd_client, sql_tables, gd_worksheets ):
	for table in sql_tables:
		# Get SQL Columns
		sql_columns = getColumnList( db, table )

		# Get Google Docs Worksheet Columns
		(ss_key, ws_key) = findWorksheetKeys( gd_worksheets, table )
		ws_columns = getWorksheetColumnList( gd_client, ss_key, ws_key )

		# Remove extra columns
		print "Extra Items:", table
		print missingItems( ws_columns, sql_columns )
		removeColumnsFromTable( db, table, missingItems( ws_columns, sql_columns ) )

		# Add new columns
		print "Missing Items:", table
		print missingItems( sql_columns, ws_columns )
		addColumnsToTable( db, table, missingItems( sql_columns, ws_columns ) )


# Get list of tables
sql_tables = getTableList( db )

# Get list of worksheets
gd_worksheets = getWorksheetList( gd_client )

# Update each of the tables with their corresponding worksheets
updateSQLColumns( db, gd_client, sql_tables, gd_worksheets )

# Update the contents of each of the columns of the tables
for table in sql_tables:
	# Get Google Docs Worksheet List Entries
	(ss_key, ws_key) = findWorksheetKeys( gd_worksheets, table )
	l_entries = getWorksheetEntries( gd_client, ss_key, ws_key )

	# Iterate through list, looking for then contents of each of the rows
	for l_i, l_entry in enumerate(l_entries):
	# Look at the contents of each of the columns
		row_list = []
		row_id = ""

		# Look through the entries, adding each of the column,value tuples to the list
		for column in l_entry.custom:
			# Check for empty value
			if l_entry.custom[column].text is None:
				row_list.append( (column, "" ) )
			else:
				# Attempt to determine whether the string is unicode or ASCII
				try:
					l_entry.custom[column].text.decode('ascii')
				except UnicodeEncodeError:
					row_list.append( (column, l_entry.custom[column].text ) )
				else:
					row_list.append( (column, unicode( l_entry.custom[column].text, "utf-8") ) )

			# Look for row id
			if ( column == "id" ):
				row_id = l_entry.custom[column].text

		# Error if no row_id is found
		if ( row_id == "" ):
			print "ERROR: No row_id found"
			#return

		# Make sure row exists in the MySQL table, if not create it
		verifyRow( db, table, row_id )

		# Update the given MySQL row_id with the contents of the corresponding Google Docs row
		updateRow( db, table, row_id, row_list )


