# imports
from flask import Flask, request, make_response
from flask_sqlalchemy import SQLAlchemy

# initializing Flask app
app = Flask(__name__)

# Google Cloud SQL (change this accordingly)
PASSWORD ="paH6FNsGP1F10h0d"
PUBLIC_IP_ADDRESS ="34.67.0.85"
DBNAME ="Prospect_Data"
PROJECT_ID ="sonic-dialect-290819"
INSTANCE_NAME ="prospect-instance"

# configuration
app.config["SECRET_KEY"] = "yoursecretkey"
app.config["SQLALCHEMY_DATABASE_URI"]= f"mysql+mysqldb://root:{PASSWORD}@{PUBLIC_IP_ADDRESS}/{DBNAME}?unix_socket=/cloudsql/{PROJECT_ID}:{INSTANCE_NAME}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"]= True

db = SQLAlchemy(app)

# User ORM for SQLAlchemy
class User(db.Model):
	UserId = db.Column(db.Integer, primary_key = True, nullable = False)
	FirstName = db.Column(db.String(50), nullable = False)
	LastName = db.Column(db.String(50), nullable = False)
	Email = db.Column(db.String(50), nullable = False, unique = True)

@app.route('/add', methods =['POST'])
def add():
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

@app.route('/view')
def view():
	# fetches all the users
	users = User.query.all()
	# response list consisting user details
	response = list()

	for user in users:
		response.append({
			"name" : user.FirstName + " " + user.LastName,
			"email": user.Email
		})

	return make_response({
		'status' : 'success',
		'message': response
	}, 200)


if __name__ == "__main__":
	# serving the app directly
	app.run()
