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
class City(db.Model):
	CityId = db.Column(db.Integer, primary_key = True, nullable = False)
	CityName = db.Column(db.String(50), nullable = False)

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
	cityId = request.form.get('CityId')

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

if __name__ == "__main__":
	# serving the app directly
	app.run()
