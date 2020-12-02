# imports
from flask import Flask, request, make_response
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, text
# from sqlalchemy.sql import text
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
engine = create_engine(f"mysql+mysqldb://root:{PASSWORD}@{PUBLIC_IP_ADDRESS}/{DBNAME}?unix_socket=/cloudsql/{PROJECT_ID}:{INSTANCE_NAME}", convert_unicode=True)

# ORMs for SQLAlchemy
class Application(db.Model):
	ApplicationId = db.Column(db.Integer, primary_key = True, nullable = False)
	UserId = db.Column(db.Integer, nullable = False)
	CompanyId = db.Column(db.Integer, nullable = False)
	PositionTitle = db.Column(db.String(50), nullable = False)
	ApplicationLink = db.Column(db.String(100), nullable = True)
	ApplicationStatus = db.Column(db.String(50), nullable = False, default="PENDING")
	ApplicationDate = db.Column(db.DateTime, nullable = False, default=time.strftime(r"%Y-%m-%d", time.localtime()))

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
	appId = request.form.get('ApplicationId')

	app = Application.query.filter_by(ApplicationId = appId).first()

	if app:
		response = list()
		response.append({
			"userId" : app.UserId,
			"companyId" : app.CompanyId, # TODO: return company name
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
	userId = request.form.get('UserId')

	user = User.query.filter_by(UserId = userId).first()
	
	if user:
		try:
			applications = Application.query.filter_by(UserId = userId).all()
			response = list()

			for app in applications:
				response.append({
					"appId" : app.ApplicationId,
					"companyId" : app.CompanyId, # TODO: return company name
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

if __name__ == "__main__":
	# serving the app directly
	app.run()
