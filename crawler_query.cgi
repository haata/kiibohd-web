#!/usr/bin/python2.4

"""
This script is used to give web-crawlers a complete dump of all the information on this site.
It is normal for this script to take a bit of time to prepare and load.
Username: kiibohdreader
Password: Kiibohd1
"""

# gdata library path
import sys
sys.path.append("/var/chroot/home/content/53/7398653/lib/python")

import cgi
import cgitb; cgitb.enable
import gdata.photos.service
import gdata.media
import gdata.geo
from MySQLdb import *

# Connect to MySQL database
hostname='kiibohdmk2.db.7398653.hostedresource.com'
username='kiibohdreader'
password='Kiibohd1'
dbname='kiibohdmk2'
db = connect( host=hostname, db=dbname, user=username, passwd=password)

# Authenticate with Picasa
gd_client = gdata.photos.service.PhotosService()

# Database Accessing Functions
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
def getRow( db, table, id ):
	# Get cursor
	curs = db.cursor()

	# Get count of rows from MySQL
	sql_command = 'SELECT * FROM ' + table + ' WHERE id = "\'' + str(id) + '\'"'
	curs.execute( sql_command )

	# Build list of tables to return
	out = curs.fetchone()

	# Close the cursor
	curs.close()

	return out

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

# Get list of images from album id and user
def getImagesFromAlbum( gd_client, username, album_id ):
	photos = gd_client.GetFeed( '/data/feed/api/user/%s/albumid/%s?kind=photo' % (username, album_id) )
	return photos

# user_key decode for album list
def getKiibohdImages( gd_client, user_key ):
	album_id = user_key.split('_')[1]
	username = user_key.split('_')[0]

	return getImagesFromAlbum( gd_client, username, album_id )

# Prints images in album given user_key
def printImages( gd_client, user_key ):
	# Check for no images
	if ( user_key == "None" or user_key == "" ):
		return

	photos = getKiibohdImages( gd_client, user_key )

	# Print medium thumbnails of each of the images, with full-size as a link
	for photo in photos.entry:
		print '<a href="%s"><img src="%s"/></a>' % (photo.content.src, photo.media.thumbnail[2].url)


print "Content-type: text/html"
print

# Header
print """
<html>
<head>
	<title>Kiibohds - Crawler Query</title>
	<link rel="shortcut icon" href="images/favicon.ico"/>
	<link rel="stylesheet" type="text/css" href="css/default.css" />
</head>
<body bgcolor="#000000" link="#77dd11" text="#cccccc" alink="#eeeeee" vlink="#77dd11"
	topmargin="0" bottommargin="0" leftmargin="0" rightmargin="0" marginheight="0" marginwidth="0">
"""

# Body
table_list = getTableList( db )
for table in table_list:
	# Print table name for section
	print "<h2>", table, "</h2><br>"

	# Get table column headers to use with each row
	col_list = getColumnList( db, table )

	# Iterate through all the row ID's
	for id in range( 1, getRowCount( db, table ) + 1 ):
		row_list = getRow( db, table, id )

		# Print out each of the rows
		for count,row in enumerate( row_list ):
			# Check for special columns
			if ( col_list[count] == "p1" or col_list[count] == "p2" or col_list[count] == "p3" ):
				printImages( gd_client, row[1:len(row) - 1] )
			# Link
			elif ( col_list[count] == "website" or col_list[count] == "link" ):
				print "<b>", col_list[count], "</b>:", '<a href="%s">%s</a>' % (row[1:len(row) - 1], row[1:len(row) - 1])
			# Skipped Data
			elif ( col_list[count] == "price" or col_list[count] == "othercurrency" or col_list[count] == "id" ):
				continue
			# Normal Data
			else:
				print "<b>", col_list[count], "</b>:", row[1:len(row) - 1]
			print "<br>"

		# Give each entry some room
		print "<br>"

# Footer
print """
</body>
</html>
"""

