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

APP_URL = "http://0.0.0.0:5500"

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

##
## Actually setup the Api resource routing here
##

api.add_resource(ImageUpload, '/<user_id>/<filename>', endpoint="image")


@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  response.headers.add('Access-Control-Allow-Credentials', 'true')
  return response

if __name__ == '__main__':
  app.run(debug=True, host='0.0.0.0', port=5500)
