from flask import Flask, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config["MONGO_DBNAME"] = "users_db"
mongo = PyMongo(app)
api = Api(app)

APP_URL = "http://127.0.0.1:5000"

USERS = {
  'user1': {
    'username': 'user1',
    'password': '123',
    'img': 'build an API'
  },
  'user2': {
    'username': 'user2',
    'password': '123',
    'img': 'build an API'
  },
  'user3': {
    'username': 'user3',
    'password': '123',
    'img': 'build an API'
  },
}


def abort_if_user_doesnt_exist(user_id):
  if user_id not in USERS:
    abort(404, message="User {} doesn't exist".format(user_id))

parser = reqparse.RequestParser()
parser.add_argument('img')


# Todo
# shows a single todo item and lets you delete a todo item
class User(Resource):
  def get(self, user_id):
    data = []

    if user_id:
      user_info = mongo.db.users.find_one({"username": user_id}, {"_id": 0})
      if user_info:
        return jsonify({"status": "ok", "data": user_info})
      else:
        return {"response": "no user found for {}".format(user_id)}
    return jsonify({"response": data})

  def delete(self, user_id):
    mongo.db.users.remove({'username': user_id})
    return '', 204

  def put(self, user_id):
    data = request.get_json()
    mongo.db.users.update({'username': user_id}, {'$set': data})
    return "ok", 201


# TodoList
# shows a list of all todos, and lets you POST to add new tasks
class UserList(Resource):
  def get(self):
    data = []

    cursor = mongo.db.users.find({}, {"_id": 0, "update_time": 0}).limit(10)

    for user in cursor:
        print user
        user = APP_URL + "/" + user.get('username')
        data.append(user)

    return jsonify({"response": data})

  def post(self):
    data = request.get_json()
    if not data:
      data = {"response": "ERROR"}
      return jsonify(data)
    else:
      username = data.get('username')
      if username:
        if mongo.db.users.find_one({"username": username}):
          return {"response": "user already exists."}
        else:
          mongo.db.users.insert(data)
          return {"response": "post ok"}
      else:
        return {"response": "username number missing"}


##
## Actually setup the Api resource routing here
##
api.add_resource(UserList, '/', endpoint="users")
api.add_resource(User, '/<user_id>', endpoint="username")

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', 'http://127.0.0.1:8989')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  response.headers.add('Access-Control-Allow-Credentials', 'true')
  return response

# @app.after_request
# def add_cors(resp):
#   """ Ensure all responses have the CORS headers. This ensures any failures are also accessible
#       by the client. """
#   resp.headers['Access-Control-Allow-Origin'] = Flask.request.headers.get('Origin','*')
#   resp.headers['Access-Control-Allow-Credentials'] = 'true'
#   resp.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS, GET'
#   resp.headers['Access-Control-Allow-Headers'] = Flask.request.headers.get(
#     'Access-Control-Request-Headers', 'Authorization' )
#   # set low for debugging
#   if app.debug:
#     resp.headers['Access-Control-Max-Age'] = '1'
#   return resp

if __name__ == '__main__':
  app.run(debug=True)
