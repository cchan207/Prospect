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
class State(db.Model):
	StateId = db.Column(db.Integer, primary_key = True, nullable = False)
	StateName = db.Column(db.String(50), nullable = False)

# Takes in stateId, returns state associated with stateId
@app.route('/api/v1/search/states', methods = ['GET'])
def get_state():
	# get stateId
	stateId = request.form.get('StateId')

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

if __name__ == "__main__":
	# serving the app directly
	app.run()
