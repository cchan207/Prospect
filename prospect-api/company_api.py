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
class Company(db.Model):
	CompanyId = db.Column(db.Integer, primary_key = True, nullable = False)
	CompanyName = db.Column(db.String(50), nullable = False)
	CompanyWebsite = db.Column(db.String(100), nullable = True)

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
	compId = request.form.get('CompanyId')

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

if __name__ == "__main__":
	# serving the app directly
	app.run()
