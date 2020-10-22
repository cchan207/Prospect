from flask import Flask, jsonify, request
from db import get_users

app = Flask(__name__)

@app.route('/', methods=['GET'])
def users():
    return get_users()    

if __name__ == '__main__':
    app.run()