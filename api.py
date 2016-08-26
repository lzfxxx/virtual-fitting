from flask import Flask, jsonify, request, make_response,redirect,url_for
from flask_restful import reqparse, abort, Api, Resource
from flask_pymongo import PyMongo
from flask_httpauth import HTTPBasicAuth
from PIL import Image
import matlab.engine

UPLOAD_FOLDER = 'file-uploads'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

app = Flask(__name__)
app.config["MONGO_DBNAME"] = "users_db"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
mongo = PyMongo(app)
api = Api(app)
auth = HTTPBasicAuth()

APP_URL = "http://0.0.0.0:5000"

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

@auth.get_password
def get_password(username):
  user = mongo.db.users.find_one({"username": username})
  if user:
    return user.get('password')
  return None


@auth.error_handler
def unauthorized():
  # return 403 instead of 401 to prevent browsers from displaying the default
  # auth dialog
  return make_response(jsonify({'message': 'Unauthorized access'}), 403)

def abort_if_user_doesnt_exist(user_id):
  if user_id not in USERS:
    abort(404, message="User {} doesn't exist".format(user_id))

parser = reqparse.RequestParser()
parser.add_argument('img')


class User(Resource):
  decorators = [auth.login_required]
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
    # mongo.db.users.remove({'resized': 'true'})
    return '', 204


class ImageUpload(Resource):
  # decorators = [auth.login_required]
  def get(self, user_id, filename):
    filename = user_id + '_' + filename
    print filename
    return mongo.send_file(filename)

  def post(self, user_id, filename):
    image = request.files['file']
    im = Image.open(image)
    print(image)
    print(im.size)
    width, height = im.size
    if width == height:
      size = (500, 500)
      im = im.resize(size)
      image.seek(0)
      # mongo.db.users.update({'username': user_id}, {'resized': 'true'})
    im.save(image, "png")
    image.seek(0)
    filename = user_id + '_' + filename
    print filename
    mongo.save_file(filename,image)
    return mongo.send_file(filename)

  def put(self, user_id, filename):
    data = request.get_json()
    mongo.db.users.update({'username': user_id}, {'$set': data})
    return "ok", 201


class UserList(Resource):
  # decorators = [auth.login_required]
  def get(self):
    data = []

    cursor = mongo.db.users.find()

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


class Results(Resource):
  def get(self, user_id):
    user_info = mongo.db.users.find_one({"username": user_id})
    LS1 = user_info.get("LS1")
    RS1 = user_info.get("RS1")
    eng = matlab.engine.start_matlab()
    ret = eng.main('IMG_6708.JPG', 'IMG_6710.JPG', 177, [[1,2],[3,4]], [[5,6],[7,8]], [9,10], [[11,12],[13,14]], [[15,16],[17,18]], [[19,20],[21,22]], [23,24]);
    eng.quit()
    print(ret)
    return ret
    # image2 = mongo.send_file(filename2)
    # image3 = mongo.send_file(filename3)



##
## Actually setup the Api resource routing here
##
api.add_resource(UserList, '/', endpoint="users")
api.add_resource(User, '/<user_id>', endpoint="username")
api.add_resource(ImageUpload, '/<user_id>/<filename>', endpoint="image")
api.add_resource(Results, '/results/<user_id>', endpoint="results")


@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  response.headers.add('Access-Control-Allow-Credentials', 'true')
  return response

if __name__ == '__main__':
  app.run(debug=True, host='0.0.0.0')
