from flask import Flask, jsonify, request, make_response,redirect,url_for,g
from flask_restful import reqparse, abort, Api, Resource
from flask_pymongo import PyMongo
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth
from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)
from werkzeug.security import generate_password_hash, check_password_hash
from PIL import Image
# from passlib.apps import custom_app_context as pwd_context
import matlab.engine

UPLOAD_FOLDER = 'file-uploads'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

app = Flask(__name__)
app.config["MONGO_DBNAME"] = "users_db"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SECRET_KEY'] = 'fitting'
mongo = PyMongo(app)
api = Api(app)
auth = HTTPBasicAuth()
authT = HTTPTokenAuth(scheme='Token')


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

#token auth
@authT.verify_token
def verify_auth_token(auth_token):
  serial = Serializer(app.config['SECRET_KEY'])
  try:
    data = serial.loads(auth_token)
  except SignatureExpired:
    return None
  except BadSignature:
    return None
  serial_user = data['username']
  return serial_user

@authT.error_handler
def unauthorized():
  # return 403 instead of 401 to prevent browsers from displaying the default
  # auth dialog
  return make_response(jsonify({'message': 'Unauthorized token access'}), 403)

def abort_if_user_doesnt_exist(user_id):
  if user_id not in USERS:
    abort(404, message="User {} doesn't exist".format(user_id))

#basic auth
@auth.verify_password
def verify_password(username, password):
  g.user = None
  user = mongo.db.users.find_one({"username": username})
  if user:
    if check_password_hash(user.get('password'), password):
      g.user = username
      return True
  return False

# @auth.get_password
# def get_password(username):
#   user = mongo.db.users.find_one({"username": username})
#   if user:
#     return user.get('password')
#   return None


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


def generate_auth_token(username, expiration=604800):
  gen_serial = Serializer(app.config['SECRET_KEY'], expires_in=expiration)
  return gen_serial.dumps({'username': username})

class User(Resource):
  decorators = [auth.login_required]
  def get(self, user_id):
    data = []
    if user_id:
      user_info = mongo.db.users.find_one({"username": user_id}, {"_id": 0})
      if user_info:
        print(user_id,' login')
        return_token = generate_auth_token(user_id)
        return {'token':return_token.decode(), "data": user_info}, 200
        # return jsonify({"status": "ok", "data": user_info})
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
          print(data)
          pw = data.get('password')
          print(generate_password_hash(pw))
          # data.hash_password(pw)
          data['password'] = generate_password_hash(pw)
          print(data)
          mongo.db.users.insert(data)
          return {"response": "post ok"}
      else:
        return {"response": "username number missing"}


class Compute(Resource):
  def get(self, user_id):
    user_info = mongo.db.users.find_one({"username": user_id})
    print("getting data")
    FT = user_info.get("FT")
    FB = user_info.get("FB")
    ST = user_info.get("ST")
    SB = user_info.get("SB")
    TC = user_info.get("TC")
    CC = user_info.get("CC")
    H = user_info.get("H")
    path_front = 'http://0.0.0.0:5000/' + user_id + '/img1.jpg'
    path_side = 'http://0.0.0.0:5000/' + user_id + '/img2.jpg'
    eng = matlab.engine.start_matlab()
    # ft = matlab.double([FT[0],FT[1]])
    absH = float(H)
    rheight_front = matlab.double([[FT[0],FT[1]],[FB[0],FB[1]]])
    rheight_side = matlab.double([[ST[0],ST[1]],[SB[0],SB[1]]])
    rtoe_side = matlab.double([TC[0],TC[1]])
    rchest_side_midpoint = matlab.double([CC[0],CC[1]])
    rwaist_front = matlab.double([[-1,-1],[-1,-1]])
    rwaist_side = matlab.double([[-1,-1],[-1,-1]])
    rchest_front = matlab.double([[-1,-1],[-1,-1]])
    print(rheight_front, rheight_side, rtoe_side, rwaist_front, rwaist_side, rchest_front, rchest_side_midpoint)
    print("running matlab")
    # print(path_front, path_side)
    ret = eng.main(path_front, path_side, absH, rheight_front, rheight_side, rtoe_side, rwaist_front, rwaist_side, rchest_front, rchest_side_midpoint)
    # ret = eng.calculation(path_front, path_side, 177, rheight_front, rheight_side, rtoe_side, rwaist_front, rwaist_side, rchest_front, rchest_side_midpoint)
    eng.quit()
    print(ret)
    mongo.db.users.update({'username': user_id}, {'$set': ret})
    waist = user_info.get("waist_len")
    chest = user_info.get("chest_len")
    print(waist, chest)
    return 200
    # image2 = mongo.send_file(filename2)
    # image3 = mongo.send_file(filename3)

class Results(Resource):
  decorators = [authT.login_required]
  def get(self, user_id):
    user_info = mongo.db.users.find_one({"username": user_id})
    H = user_info.get("H")
    waist = user_info.get("waist_len")
    chest = user_info.get("chest_len")
    return {"height": H, "waist": waist, "chest": chest}

##
## Actually setup the Api resource routing here
##
api.add_resource(UserList, '/', endpoint="users")
api.add_resource(User, '/<user_id>', endpoint="username")
api.add_resource(ImageUpload, '/<user_id>/<filename>', endpoint="image")
api.add_resource(Compute, '/compute/<user_id>', endpoint="compute")
api.add_resource(Results, '/results/<user_id>', endpoint="results")


@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  response.headers.add('Access-Control-Allow-Credentials', 'true')
  return response

if __name__ == '__main__':
  app.run(debug=True, host='0.0.0.0',threaded=True)
