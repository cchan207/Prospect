# imports
from flask import Flask, request, make_response
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, text, func
from sqlalchemy.orm import sessionmaker
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

# Create a session
Session = sessionmaker(bind=engine, autocommit=False)

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

# Takes in applicationId, returns application fields associated with this applicationId
@app.route('/api/v1/search/applications', methods = ['GET'])
def get_application():
	# get applicationId to find associated application
	appId = request.args.get("applicationId")

	app = Application.query.filter_by(ApplicationId = appId).first()

	connection = engine.connect()
	if app:
		try:

			locations_query = text(
				'SELECT * FROM applicationlocation al JOIN city c JOIN state s ON al.CityId = c.CityId AND al.StateId = s.StateId WHERE al.ApplicationId = :a_id;'
			)

			locations = engine.execute(locations_query, a_id = appId)

			response = list()
			for loc in locations:
				response.append({
					"CityName" : loc.CityName,
					"StateName" : loc.StateName,
					"StateAbbr" : loc.StateAbbr,
				})

			application_query = text(
				'SELECT * FROM company c JOIN application a ON a.CompanyId = c.CompanyId WHERE a.ApplicationId = :a_id;'
			)

			application = engine.execute(application_query, a_id = appId).fetchone()

			recruiters_query = text(
				'SELECT * FROM recruiter r JOIN application a ON a.RecId = r.RecId WHERE a.ApplicationId = :a_id;'
			)

			recruiters = engine.execute(recruiters_query, a_id = appId)

			response2 = list()
			for rec in recruiters:
				response2.append({
					"RecFirstName" : rec.RecFirstName,
					"RecLastName" : rec.RecLastName,
					"RecEmail" : rec.RecEmail,
					"RecPhone" : rec.RecPhone
				})

			# response
			responseObject = {
				'ApplicationId' : application.ApplicationId,
				'UserId' : application.UserId,
				'CompanyName':application.CompanyName,
				'PositionTitle' : application.PositionTitle,
				'ApplicationStatus' : application.ApplicationStatus,
				'ApplicationDate' : application.ApplicationDate,
				'ApplicationLink' : application.ApplicationLink,
				'Recruiter' : response2,
				'Locations' : response

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

# Updates application in application table
# Parameters: application id, position title, application link, company name, application status,
# current city name, new city name, new state name
# If field hasn't changed, send current value
@app.route('/api/v1/update/applications', methods = ['POST'])
def update_application():
    appId = request.form.get('id')
    appPos = request.form.get('title')
    appLink = request.form.get('link')
    compName = request.form.get('company')
    appStatus = request.form.get('status')
    appOldCity = request.form.get('oldCity') # need old city as part of key for application location
                                             # < applicationId, oldCity >
    appNewCity = request.form.get('newCity')
    appNewState = request.form.get('newState')

    print(appId)

    app = Application.query.filter_by(ApplicationId = appId).first()

    if app:
        try:
            session = Session()
            session.connection(execution_options={'isolation_level': 'READ UNCOMMITTED'})

            # get company object
            comp = session.query(Company).filter_by(CompanyName=compName).first()
            print(comp)

            # add company if not in company table
            if comp is None:
                compId = session.query(func.max(Company.CompanyId)).scalar() + 1
                print(compId)
                company = Company(
                    CompanyId = compId,
                    CompanyName = compName,
                    CompanyWebsite = None # TODO: we don't let users enter the website for now
                )
                session.add(company)
            else:
                compId = comp.CompanyId

            oldCity = session.query(City).filter_by(CityName=appOldCity).first()
            print("old city: ", oldCity.CityId)
            oldLocation = session.query(Applicationlocation).filter_by(ApplicationId=appId, CityId=oldCity.CityId).first()
            print(oldLocation.StateId)
            newStateId = session.query(State.StateId).filter_by(StateName=appNewState).first()[0]
            print("state id: ", newStateId)

            # only change location if location has changed
            if oldLocation is not None and (appNewCity != appOldCity or oldLocation.StateId != newStateId):
                # get city objects and state id
                newCity = session.query(City).filter_by(CityName=appNewCity).first()
                print("new city: ", newCity)

                # add city if not in city table
                if newCity is None:
                    cityId = session.query(func.max(City.CityId)).scalar() + 1
                    print(cityId)
                    city = City(
                        CityId = cityId,
                        CityName = appNewCity
                    )
                    session.add(city)
                else:
                    print("HERE")
                    cityId = newCity.CityId
                
                print("new city id: ", cityId)

                # update old location from application location table
                oldLocation = session.query(Applicationlocation) \
                            .filter_by(ApplicationId=appId, CityId=oldCity.CityId) \
                            .update({"CityId": cityId, "StateId": newStateId})
            print("HERE")

            # update application
            application = session.query(Application).filter_by(ApplicationId=appId).update({
                "CompanyId" : compId,
                "PositionTitle" : appPos,
                "ApplicationLink" : appLink,
                "ApplicationStatus" : appStatus
            })
            print("UPDATING APP")
            session.commit()

            return make_response({
                'status' : 'success',
                'message': 'Sucessfully updated.'
            }, 200)
        except:
            session.rollback()
            return make_response({
                'status' : 'failed',
                'message' : 'Some error occured !!'
            }, 400)
        finally:
            session.close() 
    else:
        return make_response({
            'status' : 'failed',
            'message' : 'Application does not exist !!'
        }, 400)

# Adds new application to application table
# Parameters: user email, position title, application link, company name, application status,
# city name, full state name
# Application link and status can be None
@app.route('/api/v1/add/applications', methods = ['POST'])
def add_application():
    userEmail = request.form.get('email')
    appPos = request.form.get('title')
    appLink = request.form.get('link')
    compName = request.form.get('company')
    appStatus = request.form.get('status')
    appCity = request.form.get('city')
    appState = request.form.get('state')

    user = User.query.filter_by(Email = userEmail).first()

    if user:
        try:
            session = Session()
            session.connection(execution_options={'isolation_level': 'READ UNCOMMITTED'})

            # get unique application id
            id = session.query(func.max(Application.ApplicationId)).scalar() + 1
            print(id)
            # get company id from company name
            comp = session.query(Company).filter_by(CompanyName=compName).first()
            print(comp)

            # add company if not already in company table
            if comp is None:
                compId = session.query(func.max(Company.CompanyId)).scalar() + 1
                print(compId)
                company = Company(
                    CompanyId = compId,
                    CompanyName = compName,
                    CompanyWebsite = None # TODO: we don't let users enter the website for now
                )
                session.add(company)
            else:
                compId = comp.CompanyId

            print("Added company")
            print(compId)

            app = Application(
                ApplicationId = id,
                UserId = user.UserId,
                CompanyId = compId,
                PositionTitle = appPos,
                ApplicationLink = appLink,
                ApplicationStatus = appStatus,
                ApplicationDate = None
            )

            # add application to application table
            session.add(app)

            print("Added application")

            # get city id and state id
            city = session.query(City).filter_by(CityName=appCity).first()
            print(city)
            stateId = session.query(State.StateId).filter_by(StateName=appState).first()[0]
            print(stateId)

            # add city if not in city table
            if city is None:
                cityId = session.query(func.max(City.CityId)).scalar() + 1
                city = City(
                    CityId = cityId,
                    CityName = appCity
                )
                session.add(city)
            else:
                cityId = city.CityId

            appLocation = Applicationlocation(
                ApplicationId = id,
                CityId = cityId,
                StateId = stateId
            )

            # add location to application location
            session.add(appLocation)
            session.commit()

            return make_response({
                'status' : 'success',
                'message': 'Sucessfully registered.'
            }, 200)
        except:
            session.rollback()
            return make_response({
                'status' : 'failed',
                'message' : 'Some error occured !!'
            }, 400)
        finally:
            session.close()
    else:
        return make_response({
            'status' : 'failed',
            'message' : 'User does not exist !!'
        }, 400)

# Deletes application from application table and all associated entries in application location table
# Parameters: application id
@app.route('/api/v1/delete/applications', methods = ['POST', 'DELETE'])
def delete_application():
    # get applicationId to find associate application
    appId = request.form.get('ApplicationId')

    try:
        # create a Session
        session = Session()
        session.connection(execution_options={'isolation_level': 'READ UNCOMMITTED'})
        app = session.query(Application).filter_by(ApplicationId = appId).first()
        print(app.ApplicationId)

        if (app):
            print("hello1")

            session.delete(app)
            print("hello2")

            # Delete each entry in Location table associated with Application
            location = session.query(Applicationlocation).filter_by(ApplicationId = appId).all()

            if len(location) != 0:
                for l in location:
                    session.delete(l)

            session.commit()

            responseObject = {
                'status' : 'success',
                'message' : 'Sucessfully deleted.'
            }
            return make_response(responseObject, 200)
        else:
            session.rollback()
            return make_response({
            'status' : 'failed',
            'message' : 'Some error occured !!'
        }, 400)
    except:
        # on rollback, the same closure of state
        # as that of commit proceeds.
        session.rollback()
        return make_response({
            'status' : 'failed',
            'message' : 'Some error occured !!'
        }, 400)
    finally:
        session.close()

if __name__ == "__main__":
    # serving the app directly
    app.run()
