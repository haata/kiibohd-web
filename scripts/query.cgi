#!/usr/bin/python2

"""
This script is used to perform generic queries on the database tables.
Depending on the inputs, the 
The data recieved also references other cgi scripts so that external functionality can be added without
 changing termlib.js or kiibohd.js
kiibohd.js uses AJAX to request this script on startup.
"""

# gdata library path
import sys
sys.path.append("/var/chroot/home/content/53/7398653/lib/python")

import cgi
import cgitb; cgitb.enable
from MySQLdb import *

# Connect to MySQL database
hostname='<your hostname>'
username='<your username>'
password='<your password>'
dbname='<your database>'
db = connect( host=hostname, db=dbname, user=username, passwd=password)

# Determine the number of rows in the given table
def getRowCount( db, table ):
	# Get cursor
	curs = db.cursor()

	# Get count of rows from MySQL
	curs.execute( 'SELECT COUNT(*) FROM ' + table ) 

	# Build list of tables to return
	out = curs.fetchone()[0]

	# Close the cursor
	curs.close()

	return out

# Get row using ID
def getRow( db, table, search_cols, query ):
	# Get cursor
	curs = db.cursor()

	# Get count of rows from MySQL
	# Return all items if no query is given
	if len( query ) == 0:
		sql_command = 'SELECT * FROM ' + table
	else:
		sql_command = 'SELECT * FROM ' + table + ' WHERE MATCH (' + search_cols + ') AGAINST (\'' + query + '\' IN BOOLEAN MODE)'
	curs.execute( sql_command )

	# Build list of tables to return
	out = curs.fetchall()

	# Close the cursor
	curs.close()

	return out

# Get list of columns from the specified MySQL table
def getColumnList( database, table ):
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


# MIME Header
print "Content-type: application/json"
print

# Get request data
inputData = cgi.FieldStorage()

# First isolate the search parameters from the query
searchParms = inputData.getvalue('query').replace( inputData.getvalue('table'), "", 1 )


# Prepare Table and Column List
table = inputData.getvalue('table').title()
col_list = getColumnList( db, table )

# String indicating the columns to search in the MySQL database
parse_cols = ""

# Bah, stupid no clean and efficient switch/case in Python <rant end>
if table == "Keyboards":
	# Missing: dateofmanufacture,dateofaquisition,price,othercurrency,id,p1,p2,p3
	parse_cols = "manufacturer,brand,modelno,switch,keycaps,connector,placeofmanufacture,status,placeofacquisition,conditionofacquisition,currentcondition,originallayout,currentlayout,noofkeys,serialno,fccidno,extras,notes,type,website"
elif table == "Switches":
	# TODO
	parse_cols = "manufacturer,brand,name,type,variant,effect"
elif table == "Calculators":
	# Missing: dateofmanufacture,dateofaquisition,price,othercurrency,id,p1,p2,p3
	parse_cols = "manufacturer,brand,modelno,switch,keycaps,connector,placeofmanufacture,status,placeofacquisition,conditionofacquisition,currentcondition,originallayout,currentlayout,noofkeys,serialno,fccidno,extras,notes,type,website"
elif table == "Forgettables":
	# Missing: dateofmanufacture,dateofaquisition,price,othercurrency,id,p1,p2,p3
	parse_cols = "manufacturer,brand,modelno,switch,keycaps,connector,placeofmanufacture,status,placeofacquisition,conditionofacquisition,currentcondition,originallayout,currentlayout,noofkeys,serialno,fccidno,extras,notes,type,website"
elif table == "Typewriters":
	# Missing: dateofmanufacture,dateofaquisition,price,othercurrency,id,p1,p2,p3
	parse_cols = "manufacturer,brand,modelno,switch,keycaps,connector,placeofmanufacture,status,placeofacquisition,conditionofacquisition,currentcondition,originallayout,currentlayout,noofkeys,serialno,fccidno,extras,notes,type,website"
elif table == "News":
	# Missing: date,id
	parse_cols = "title,poster,content"
elif table == "Links":
	# Missing: id
	parse_cols = "name,link,type,description"
elif table == "Crawler":
	# TODO
	parse_cols = ""
elif table == "Articles":
	# Missing: date,datemodified,id
	parse_cols = "title,content"





print "{ \"element\": ["

# Query list of rows matching the query
row_list = getRow( db, table, parse_cols, searchParms )

# Iterate through the list of rows, generating the JSON data structure
for row in row_list:
	print "\t{"

	# Print out each of the rows as JSON
	for count,item in enumerate( row ):
		if count == len(col_list) - 1:
			print "\t\t\"" + col_list[count] + "\": \"" + item[1:len(item) - 1] + "\""
		else:
			print "\t\t\"" + col_list[count] + "\": \"" + item[1:len(item) - 1] + "\", "

	if row == row_list[len(row_list) - 1]:
		print "\t}"
	else:
		print "\t},"

print "]}"

