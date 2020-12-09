# Prospect
CS348 Team NULL

Prospect was inspired by the team's own job search experiences. This job application tracker allows users to organize application information like position title, company, location, recruiter, and application status in one central location. The dashboard displays each job application along with summary statistics and charts.

This web application with create with a ReactJS frontend, Cloud SQL database, and Python Flask API. We are also using Auth0 for user authentication.

### Developer information

#### Database migration
python api.py db init       \
python api.py db migrate    \
python api.py db upgrade    \
python api.py db --help

https://flask-migrate.readthedocs.io/en/latest/

#### Whitelisting api

1. Go to google cloud sql console
2. Click on prospect-instance
3. Go to connections in left panel
4. Find your ip by googling "my ip"
5. Add your public IP address to Authorized networks
ex. 128.210.107.129s
