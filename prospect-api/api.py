# imports
from flask import Flask, request, make_response
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, text
from flask_migrate import Migrate
import time

# initializing Flask app
app = Flask(__name__)

# Google Cloud SQL (change this accordingly)
PASSWORD ="paH6FNsGP1F10h0d"
PUBLIC_IP_ADDRESS ="34.67.0.85"
DBNAME ="Prospect_Data"
PROJECT_ID ="sonic-dialect-290819"
INSTANCE_NAME ="prospect-instance"

# configuration
app.config["DEBUG"] = True
app.config["SECRET_KEY"] = "yoursecretkey"
app.config["SQLALCHEMY_DATABASE_URI"]= f"mysql+mysqldb://root:{PASSWORD}@{PUBLIC_IP_ADDRESS}/{DBNAME}?unix_socket=/cloudsql/{PROJECT_ID}:{INSTANCE_NAME}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"]= True

db = SQLAlchemy(app)
migrate = Migrate(app, db)
engine = create_engine(f"mysql+mysqldb://root:{PASSWORD}@{PUBLIC_IP_ADDRESS}/{DBNAME}?unix_socket=/cloudsql/{PROJECT_ID}:{INSTANCE_NAME}", convert_unicode=True)

# ORMs for SQLAlchemy
class User(db.Model):
	UserId = db.Column(db.Integer, primary_key = True, nullable = False)
	FirstName = db.Column(db.String(50), nullable = False)
	LastName = db.Column(db.String(50), nullable = False)
	Email = db.Column(db.String(50), nullable = False, unique = True)

class Application(db.Model):
	ApplicationId = db.Column(db.Integer, primary_key = True, nullable = False)
	UserId = db.Column(db.Integer, nullable = False)
	CompanyId = db.Column(db.Integer, nullable = False)
	PositionTitle = db.Column(db.String(50), nullable = False)
	ApplicationLink = db.Column(db.String(100), nullable = True)
	ApplicationStatus = db.Column(db.String(50), nullable = False, default="PENDING")
	ApplicationDate = db.Column(db.DateTime, nullable = False, default=time.strftime(r"%Y-%m-%d", time.localtime()))

class Applicationlocation(db.Model):
	ApplicationId = db.Column(db.Integer, primary_key = True, nullable = False)
	CityId = db.Column(db.Integer, nullable = False)
	StateId = db.Column(db.Integer, nullable = False)

class City(db.Model):
	CityId = db.Column(db.Integer, primary_key = True, nullable = False)
	CityName = db.Column(db.String(50), nullable = False)

class Company(db.Model):
	CompanyId = db.Column(db.Integer, primary_key = True, nullable = False)
	CompanyName = db.Column(db.String(50), nullable = False)
	CompanyWebsite = db.Column(db.String(100), nullable = True)

class Recruiter(db.Model):
	RecId = db.Column(db.Integer, primary_key = True, nullable = False)
	CompanyId = db.Column(db.Integer, nullable = False)
	RecEmail = db.Column(db.String(50), nullable = True)
	RecFirstName = db.Column(db.String(50), nullable = False)
	RecLastName = db.Column(db.String(50), nullable = False)
	RecPhone = db.Column(db.String(50), nullable = True)

class State(db.Model):
	StateId = db.Column(db.Integer, primary_key = True, nullable = False)
	StateName = db.Column(db.String(50), nullable = False)
	StateAbbr = db.Column(db.String(2), nullable = False)

# Takes an application id, city name, and state name, adds location to applicationlocation
# Can call this multiple times for applications with multiple locations
# NOTE: Ensure that city name exists app side (reminder that city names can belong to multiple states)
@app.route('/api/v1/add/locations', methods = ['POST'])
def add_locations():
	# get application id
	appId = request.form.get('ApplicationId')
	cityName = request.form.get('CityName')
	stateName = request.form.get('StateName')

	connection = engine.connect()
	if appId:
		try:
			city_name_query = text(
				'SELECT CityId FROM city WHERE CityName = :c_name;'
			)
			state_name_query = text(
				'SELECT StateId FROM state WHERE StateName = :s_name;'
			)
			cityId = engine.execute(city_name_query, c_name = cityName).fetchone()
			stateId = engine.execute(state_name_query, s_name = stateName).fetchone()

			# make ApplicationLocation object
			appLocation = Applicationlocation(
				ApplicationId = appId,
				CityId = cityId[0],
				StateId = stateId[0]
			)
			# add to applicaton table
			db.session.add(appLocation)
			db.session.commit()

			# response
			responseObject = {
				'status' : 'success',
				'message': 'Sucessfully registered.'
			}
			return make_response(responseObject, 200)
		except:
			return make_response({
				'status' : 'failed',
				'message' : 'Some error occured !!'
			})
		finally:
			connection.close()
	else:
		responseObject = {
				'status' : 'fail',
				'message': 'Missing location fields !!'
		}
		return make_response(responseObject, 400)

# Takes in appliationId, returns city id, city name, state id, and state name
@app.route('/api/v1/search/locations', methods = ['GET'])
def get_locations():
	# get application id
	appId = request.args.get('ApplicationId')

	appLocation = Applicationlocation.query.filter_by(ApplicationId = appId).first()

	connection = engine.connect()
	if appLocation:
		try:
			response = list()

			city_name_query = text(
				'SELECT CityName FROM city WHERE CityId = :c_id;'
			)
			state_name_query = text(
				'SELECT StateName FROM state WHERE StateId = :s_id;'
			)

			city = engine.execute(city_name_query, c_id = appLocation.CityId).fetchone()
			state = engine.execute(state_name_query, s_id = appLocation.StateId).fetchone()

			response.append({
				"cityId" : appLocation.CityId,
				"cityName" : city[0],
				"stateId" : appLocation.StateId,
				"stateName" : state[0]
			})

			return make_response({
					'status' : 'success',
					'message' : response
				}, 200)
		except:
			return make_response({
				'status' : 'failed',
				'message' : 'Some error occured !!'
			}, 400)
		finally:
			connection.close()
	else:
		responseObject = {
				'status' : 'failed',
				'message': 'Application does not exist !!'
		}
		return make_response(responseObject, 400)

# Takes in companyId, recFirstName, recLastName, recEmail, recPhone
# companyId, firstName and lastName is required, the others are nullable
@app.route('/api/v1/add/recruiters', methods = ['POST'])
def add_recruiter():
	# get recruiter info
	compId = request.form.get('CompanyId')
	recEmail = request.form.get('RecEmail')
	recFirstName = request.form.get('RecFirstName')
	recLastName = request.form.get('RecLastName')
	recPhone = request.form.get('RecPhone')

	if compId and recFirstName and recLastName:
		try:
			# get unique recruiter id
			recruiters = engine.execute('SELECT * FROM recruiter;')
			recId = 1
			for rec in recruiters:
				if (rec.RecId - recId == 0):
					recId = recId + 1
				else:
					break

			# make Recruiter object
			recruiter = Recruiter(
				RecId = recId,
				CompanyId = compId,
				RecEmail = recEmail,
				RecFirstName = recFirstName,
				RecLastName = recLastName,
				RecPhone = recPhone
			)
			# add to applicaton table
			db.session.add(recruiter)
			db.session.commit()

			# response
			responseObject = {
				'status' : 'success',
				'message': 'Sucessfully registered.'
			}
			return make_response(responseObject, 200)
		except:
			return make_response({
				'status' : 'failed',
				'message' : 'Some error occured !!'
			})
	else:
		responseObject = {
				'status' : 'fail',
				'message': 'Missing recruiter fields !!'
		}
		return make_response(responseObject, 400)


# Takes in recId, deletes recruiter associated with recId
@app.route('/api/v1/delete/recruiters', methods = ['POST', 'DELETE'])
def delete_recruiter():
	# get recId
	recId = request.form.get('RecId')

	recruiter = Recruiter.query.filter_by(RecId = recId).first()

	connection = engine.connect()
	if recruiter:
		try:
			delete_query = text(
				'DELTE FROM recruiter WHERE RecId = :r_id;'
			)
			engine.execute(delete_query, r_id = recId)

			# response
			responseObject = {
				'status' : 'success',
				'message' : 'Sucessfully updated.'
			}
			return make_response(responseObject, 200)
		except:
			return make_response({
				'status' : 'failed',
				'message' : 'Some error occured !!'
			}, 400)
		finally:
			connection.close()
	else:
		responseObject = {
				'status' : 'fail',
				'message': 'Recruiter does not exist !!'
		}
		return make_response(responseObject, 400)

# Takes in recId, returns recruiter associated with recId
@app.route('/api/v1/search/recruiters', methods = ['GET'])
def get_recruiter():
	# get recId
	recId = request.args.get('RecId')

	recruiter = Recruiter.query.filter_by(RecId = recId).first()

	if recruiter:
		company = Company.query.filter_by(CompanyId = recruiter.CompanyId).first()
		response = list()
		response.append({
			"companyId" : recruiter.CompanyId,
			"companyName" : company.CompanyName,
			"recEmail" : recruiter.RecEmail,
			"recName" : recruiter.RecFirstName + " " + recruiter.RecLastName,
			"recPhone" : recruiter.RecPhone
		})
		return make_response({
				'status' : 'success',
				'message' : response
			}, 200)
	else:
		responseObject = {
				'status' : 'fail',
				'message': 'Recruiter does not exist !!'
		}
		return make_response(responseObject, 400)

# Takes in stateId, returns state associated with stateId
@app.route('/api/v1/search/states', methods = ['GET'])
def get_state():
	# get stateId
	stateId = request.args.get('StateId')

	state = State.query.filter_by(StateId = stateId).first()

	if state:
		response = list()
		response.append({
			"stateName" : state.StateName
		})

		return make_response({
				'status' : 'success',
				'message' : response
			}, 200)
	else:
		responseObject = {
				'status' : 'fail',
				'message': 'State does not exist !!'
		}
		return make_response(responseObject, 400)

# Takes in cityName, adds to city table
@app.route('/api/v1/add/cities', methods = ['POST'])
def add_city():
	# get city details
	cityName = request.form.get('CityName')

	# get id
	cityId = db.session.query(db.func.max(City.CityId)).first()[0] + 1

	try:
		# create company object
		city = City (
			CityId = cityId,
			CityName = cityName
		)
		db.session.add(city)
		db.session.commit()
		# response
		responseObject = {
			'status' : 'success',
			'message': 'Sucessfully registered.'
		}

		return make_response(responseObject, 200)
	except:
		return make_response({
				'status' : 'failed',
				'message' : 'Some error occured !!'
			}, 400)

# Takes in cityId, returns city associated with cityId
@app.route('/api/v1/search/cities', methods = ['GET'])
def get_city():
	# get cityId
	cityId = request.args.get('CityId')

	city = City.query.filter_by(CityId = cityId).first()

	if app:
		response = list()
		response.append({
			"cityName" : city.CityName
		})

		return make_response({
				'status' : 'success',
				'message' : response
			}, 200)
	else:
		responseObject = {
				'status' : 'fail',
				'message': 'City does not exist !!'
		}
		return make_response(responseObject, 400)

# Takes in companyName, companyWebsite and adds to company table
# companyName required, companyWebsite nullalbe
@app.route('/api/v1/add/companies', methods = ['POST'])
def add_company():
	# get company details
	compName = request.form.get('CompanyName')
	compWebsite = request.form.get('CompanyWebsite')

	# get id
	compId = db.session.query(db.func.max(Company.CompanyId)).first()[0] + 1

	try:

		# create company object
		comp = Company (
			CompanyId = compId,
			CompanyName = compName,
			CompanyWebsite = compWebsite
		)
		db.session.add(comp)
		db.session.commit()
		# response
		responseObject = {
			'status' : 'success',
			'message': 'Sucessfully registered.'
		}

		return make_response(responseObject, 200)
	except:
		return make_response({
				'status' : 'failed',
				'message' : 'Some error occured !!'
			}, 400)


# Takes in companyId, returns company associated with this companyId
@app.route('/api/v1/search/companies', methods = ['GET'])
def get_company():
	# get companyId to find associated company
	compId = request.args.get('CompanyId')

	comp = Company.query.filter_by(CompanyId = compId).first()

	if comp:
		response = list()
		response.append({
			"companyName" : comp.CompanyName,
			"companyWebsite" : comp.CompanyWebsite
		})
		return make_response({
				'status' : 'success',
				'message' : response
			}, 200)
	else:
		responseObject = {
				'status' : 'fail',
				'message': 'Company does not exist !!'
		}
		return make_response(responseObject, 400)

# Takes in applicationId, companyId, positionTitle, applicationLink, applicationStatus, and applicationDate
# ApplicationId is required
# Modifies application associated with applicationId
# NOTE: Ensure that company exists, insert into table if not app side
@app.route('/api/v1/update/applications', methods = ['POST', 'PUT'])
def update_application():
	appId = request.form.get('ApplicationId')
	compId = request.form.get('CompanyId')
	positionTitle = request.form.get('PositionTitle')
	appLink = request.form.get('ApplicationLink')
	appStatus = request.form.get('ApplicationStatus')
	appDate = request.form.get('ApplicationDate')

	app = Application.query.filter_by(ApplicationId = appId).first()

	connection = engine.connect()
	if app:
		try:
			if compId != None:
				update_query = text(
					'UPDATE application SET CompanyId = :c_id WHERE ApplicationId = :a_id;'
				)
				engine.execute(update_query, c_id = compId, a_id = appId)
			if positionTitle != None:
				update_query = text(
					'UPDATE application SET PositionTitle = :pos_tit WHERE ApplicationId = :a_id;'
				)
				engine.execute(update_query, pos_tit = positionTitle, a_id = appId)
			if appLink != None:
				update_query = text(
					'UPDATE application SET ApplicationLink = :a_link WHERE ApplicationId = :a_id;'
				)
				engine.execute(update_query, a_link = appLink, a_id = appId)
			if appStatus != None:
				update_query = text(
					'UPDATE application SET ApplicationStatus = :a_stat WHERE ApplicationId = :a_id;'
				)
				engine.execute(update_query, a_stat = appStatus, a_id = appId)
			if appDate != None:
				update_query = text(
					'UPDATE application SET ApplicationDate = :a_date WHERE ApplicationId = :a_id;'
				)
				engine.execute(update_query, a_date = appDate, a_id = appId)

			# response
			responseObject = {
				'status' : 'success',
				'message' : 'Sucessfully updated.'
			}
			return make_response(responseObject, 200)
		except:
			return make_response({
				'status' : 'failed',
				'message' : 'Some error occured !!'
			}, 400)
		finally:
			connection.close()
	else:
		responseObject = {
				'status' : 'fail',
				'message': 'Application does not exist !!'
		}
		return make_response(responseObject, 400)

@app.route('/api/v1/delete/applications', methods = ['POST', 'DELETE'])
def delete_application():
	# get applicationId to find associate application
	appId = request.form.get('ApplicationId')

	app = Application.query.filter_by(ApplicationId = appId).first()

	connection = engine.connect()
	if app:
		try:
			application_delete_query = text(
				'DELETE FROM application WHERE ApplicationId = :a_id;'
			)
			engine.execute(application_delete_query, a_id = app.ApplicationId)

			# response
			responseObject = {
				'status' : 'success',
				'message' : 'Sucessfully deleted.'
			}
			return make_response(responseObject, 200)
		except:
			return make_response({
				'status' : 'failed',
				'message' : 'Some error occured !!'
			}, 400)
		finally:
			connection.close()
	else:
		responseObject = {
				'status' : 'fail',
				'message': 'Application does not exist !!'
		}
		return make_response(responseObject, 400)


# Takes in applicationId, returns application associated with this applicationId
@app.route('/api/v1/search/applications', methods = ['GET'])
def get_application():
	# get applicationId to find associated application
	appId = request.args.get('ApplicationId')

	app = Application.query.filter_by(ApplicationId = appId).first()

	if app:
		company = Company.query.filter_by(CompanyId = app.CompanyId).first()

		response = list()
		response.append({
			"userId" : app.UserId,
			"companyId" : app.CompanyId,
			"companyName" : company.CompanyName,
			"positionTitle" : app.PositionTitle,
			"appLink" : app.ApplicationLink,
			"appStatus" : app.ApplicationStatus,
			"appDate" : app.ApplicationDate # TODO: potentially have to fix date formatting
		})

		return make_response({
				'status' : 'success',
				'message' : response
			}, 200)
	else:
		responseObject = {
				'status' : 'fail',
				'message': 'Application does not exist !!'
		}
		return make_response(responseObject, 400)

# Takes in UserId (can be found using search users api), returns all applicatons associated with this UserId
@app.route('/api/v1/search/applications/all', methods = ['GET'])
def get_applications():
	# get userid to find all associated applications
	userId = request.args.get('UserId')

	user = User.query.filter_by(UserId = userId).first()

	connection = engine.connect()
	if user:
		try:
			applications = Application.query.filter_by(UserId = userId).all()
			application_retrieval_query = text(
				'SELECT * FROM application JOIN location'
			)
			engine.execute(application_delete_query, a_id = app.ApplicationId)

			applications = Application.query.filter_by(UserId = user.UserId).all()
			response = list()

			for app in applications:
				

				company = Company.query.filter_by(CompanyId = app.CompanyId).first()
				response.append({
					"appId" : app.ApplicationId,
					"companyId" : app.CompanyId,
					"companyName" : company.CompanyName,
					"positionTitle" : app.PositionTitle,
					"appLink" : app.ApplicationLink,
					"appStatus" : app.ApplicationStatus,
					"appDate" : app.ApplicationDate # TODO: potentially have to fix date formatting
				})

			return make_response({
				'status' : 'success',
				'message' : response
			}, 200)
		except:
			return make_response({
				'status' : 'failed',
				'message' : 'Some error occured !!'
			}, 400)
	else:
		responseObject = {
				'status' : 'fail',
				'message': 'UserId does not exist !!'
		}
		return make_response(responseObject, 400)

# Takes in UserId (can be found using search users api), CompanyId, PositionTitle, ApplicationLink, ApplicationStatus, ApplicationDate
# UserId, CompanyId, PositionTitle required, ApplicationLink can be NULL, ApplicationStatus will be default PENDING, ApplicationDate will be default now in utc
# Note: Make sure CompanyId exists, if not create a new company app side
@app.route('/api/v1/add/applications', methods = ['POST'])
def add_application():
	# geting name and email
	userId = request.form.get('UserId')
	companyId = request.form.get('CompanyId')
	positionTitle = request.form.get('PositionTitle')
	appLink = request.form.get('ApplicationLink')
	appStatus = request.form.get('ApplicationStatus')
	appDate = request.form.get('ApplicationDate')

	user = User.query.filter_by(UserId = userId).first()

	connection = engine.connect()
	if user:
		try:
			# get unique application id
			applications = engine.execute('SELECT * FROM application;')
			appId = 1
			for job in applications:
				if (job.ApplicationId - appId == 0):
					appId = appId + 1
				else:
					break

			# make Application object
			app = Application(
				ApplicationId = appId,
				UserId = userId,
				CompanyId = companyId,
				PositionTitle = positionTitle,
				ApplicationLink = appLink,
				ApplicationStatus = appStatus,
				ApplicationDate = appDate
			)
			# add to applicaton table
			db.session.add(app)
			db.session.commit()

			# response
			responseObject = {
				'status' : 'success',
				'message': 'Sucessfully registered.'
			}

			return make_response(responseObject, 200)
		except:
			responseObject = {
				'status' : 'fail',
				'message': 'Some error occured !!'
			}

			return make_response(responseObject, 400)
		finally:
			connection.close()
	else:
		responseObject = {
				'status' : 'fail',
				'message': 'User does not exist !!'
			}
		return responseObject

# Takes in first name, last name, and email to add to Users table
@app.route('/api/v1/add/user', methods =['POST'])
def add_user():
	# geting name and email
	firstName = request.form.get('FirstName')
	lastName = request.form.get('LastName')
	email = request.form.get('Email')

	# get id
	userId = db.session.query(db.func.max(User.UserId)).first()[0] + 1

	# checking if user already exists
	user = User.query.filter_by(Email = email).first()

	if not user:
		try:
			# creating Users object
			user = User(
				UserId = userId,
				FirstName = firstName,
				LastName = lastName,
				Email = email
			)
			# adding the fields to users table
			db.session.add(user)
			db.session.commit()
			# response
			responseObject = {
				'status' : 'success',
				'message': 'Sucessfully registered.'
			}

			return make_response(responseObject, 200)
		except:
			responseObject = {
				'status' : 'fail',
				'message': 'Some error occured !!'
			}

			return make_response(responseObject, 400)

	else:
		# if user already exists then send status as fail
		responseObject = {
			'status' : 'fail',
			'message': 'User already exists !!'
		}

		return make_response(responseObject, 403)

# Takes in no parameters, returns all users
@app.route('/api/v1/search/users/all', methods=['GET'])
def get_all_users():
	# fetches all the users
	users = User.query.all()
	# response list consisting user details
	response = list()

	for user in users:
		response.append({
			"id" : user.UserId,
			"name" : user.FirstName + " " + user.LastName,
			"email": user.Email
		})

	return make_response({
		'status' : 'success',
		'message': response
	}, 200)

# Takes in email as key, returns user information
@app.route('/api/v1/search/users', methods=['GET'])
def get_user():
	email = request.args.get('Email')
	# checks for email in request
	if email:
		# retrieve all rows where userid = id
		users = User.query.filter_by(Email = email).all()
		response = list()
		for user in users:
			response.append({
				"id" : user.UserId,
				"name" : user.FirstName + " " + user.LastName,
				"email" : user.Email
			})
			return make_response({
				'status' : 'success',
				'message': response
			}, 200)
	else:
		responseObject = {
				'status' : 'fail',
				'message': 'Email not provided !!'
		}
		return make_response(responseObject, 400)



if __name__ == "__main__":
	# serving the app directly
	app.run()
