# Prospect

## Database migration
python api.py db init       \
python api.py db migrate    \
python api.py db upgrade    \
python api.py db --help

https://flask-migrate.readthedocs.io/en/latest/

## Whitelisting api

1. Go to google cloud sql console
2. Click on prospect-instance
3. Go to connections in left panel
4. Find your ip by googling "my ip"
5. Add your public IP address to Authorized networks
ex. 128.210.107.129s
