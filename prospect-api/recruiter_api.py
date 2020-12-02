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
class Recruiter(db.Model):
	RecId = db.Column(db.Integer, primary_key = True, nullable = False)
	CompanyId = db.Column(db.Integer, nullable = False)
	RecEmail = db.Column(db.String(50), nullable = True)
	RecFirstName = db.Column(db.String(50), nullable = False)
	RecLastName = db.Column(db.String(50), nullable = False)
	RecPhone = db.Column(db.String(50), nullable = True)

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
	recId = request.form.get('RecId')

	recruiter = Recruiter.query.filter_by(RecId = recId).first()

	if recruiter:
		response = list()
		response.append({
			"companyId" : recruiter.CompanyId, # TODO: return company name AND company id
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

if __name__ == "__main__":
	# serving the app directly
	app.run()
