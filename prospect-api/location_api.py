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
class Applicationlocation(db.Model):
	ApplicationId = db.Column(db.Integer, primary_key = True, nullable = False)
	CityId = db.Column(db.Integer, nullable = False)
	StateId = db.Column(db.Integer, nullable = False)

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
	appId = request.form.get('ApplicationId')

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

if __name__ == "__main__":
	# serving the app directly
	app.run()
