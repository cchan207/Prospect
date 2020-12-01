# imports
from flask import Flask, request, make_response
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from datetime import datetime

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
	ApplicationDate = db.Column(db.DateTime, nullable = False, default=datetime.utcnow)

class ApplicationLocation(db.Model):
	ApplicationId = db.Column(db.Integer, primary_key = True, nullable = False)
	CityId = db.Column(db.Integer, nullable = False)
	StateId = db.Column(db.Integer, nullable = False)

class City(db.Model):
	CityId = db.Column(db.Integer, primary_key = True, nullable = False)
	CityName = db.Column(db.String(50), nullable = False)

class Company(db.Model):
	CompanyId = db.Column(db.Integer, primary_key = True, nullable = False)
	CompanyName = db.Column(db.String(50), nullable = False)

class Recruiter(db.Model):
	RecId = db.Column(db.Integer, primary_key = True, nullable = False)
	CompanyId = db.Column(db.Integer, nullable = False)
	RecEmail = db.Column(db.String(50), nullable = True)
	RecFirstName = db.Column(db.String(50), nullable = False)
	RecLastName = db.Column(db.String(50), nullable = False)
	RecPhone = db.Column(db.String(50), nullable = False)

class State(db.Model):
	StateId = db.Column(db.Integer, primary_key = True, nullable = False)
	StateName = db.Column(db.String(50), nullable = False)

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

# takes in first name, last name, and email to add to Users table
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

# takes in no parameters, returns all users
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

# takes in email as key, returns user information
@app.route('/api/v1/search/users', methods=['GET'])
def get_user():
	email = request.form.get('Email')
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
