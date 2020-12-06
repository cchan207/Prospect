# Takes in applicationId, returns application associated with this applicationId
@app.route('/api/v1/search/applications', methods = ['GET'])
def get_application():
	# get applicationId to find associated application
	appId = request.args.get("applicationId");

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



# Takes in UserEmail returns all applicatons associated with this UserEmail
@app.route('/api/v1/search/applications/all', methods = ['GET'])
def get_applications():
	# get userid to find all associated applications

	userEmail = request.args.get('userEmail')

	response = list()

	info = text(
		'SELECT * FROM application a JOIN company c ON a.CompanyId = c.CompanyId WHERE a.UserId = (SELECT UserId FROM user WHERE Email = :e_id);'
	)

	locations = text(
		'SELECT c.CityName, s.StateAbbr FROM applicationlocation al JOIN city c JOIN state s ON al.CityId = c.CityId AND al.StateId = s.StateId WHERE al.ApplicationId = :a_id ORDER BY c.CityName ASC, s.StateAbbr ASC;'
	)

	basicInfo = engine.execute(info, e_id = userEmail)

	for inf in basicInfo:
		response.append({
			"ApplicationId" : inf.ApplicationId,
			"UserId" : inf.UserId,
			"CompanyId" : inf.CompanyId,
			"CompanyName" : inf.CompanyName,
			"PositionTitle" : inf.PositionTitle,
			"ApplicationLink" : inf.ApplicationLink,
			"ApplicationStatus" : inf.ApplicationStatus,
			"ApplicationDate" : inf.ApplicationDate,
		})

		locationInfo = engine.execute(locations, a_id = inf.ApplicationId)
		for loc in locationInfo:
			response.append({
				"CityName" : loc.CityName,
				"StateAbbr" : loc.StateAbbr
			})
			break;

	responseObject = {
		'response':response,

	}
	return make_response(responseObject, 200)