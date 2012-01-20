#!/usr/bin/python2

class ResultsHandler(webapp.RequestHandler):
	def post(self):
		#k = db.Key.from_path('Engineer', the_engineer_id) #will be an integer
		#e = db.get(k)
		#output = {'salary': e.salary}
		#output = json.dumps(output) #json encoding
		self.response.write.out(" AAA! ")

	def get(self):
		self.response.write.out("GETTTTT")

