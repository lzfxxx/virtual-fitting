import pymongo
import sys
from flask import *
from flask_pymongo import PyMongo
from pymongo import MongoClient
from bson.json_util import dumps
import gridfs
from flask_cors import CORS, cross_origin


#Flask Object
app=Flask(__name__)
CORS(app)


#------- secret key --------#
app.secret_key = "secret"

# ------ configuration to daabase ------- #
app.config['MONGO_DBNAME']='drone'
mongo=PyMongo(app,config_prefix='MONGO')



@app.route('/events',methods=['GET'])
@cross_origin()
def event():

  # connnecto to the db on standard port
  #connection = MongoClient()

  # connect to the data base
  #db=connection.drone

  #collection
  #a=db.createevents.find()

  b=mongo.db.createevents.find()
  return dumps({"event":b})


@app.route('/event/insert',methods=['POST'])
@cross_origin()
def insertEvent():

  data=request.json
  postData = {
    "eventName"         : data['name'],
    "eventType"         : data['type'],
    "guestName"         : data['guestname'],
    "eventTime"         : data['whent'],
    "eventDate"         : data['whend'],
    "eventLocation"     : data['where'],
    "isEventPaid"       : data['isPaid'],
    "eventDescription"  : data['what']
  }
  mongo.db.createevents.insert(postData)
  return "ok"


# download file from server
@app.route('/upload/<path:filename>',methods=['POST'])
def save_upload(filename):

  # file
  #print(request.files['file'])
  mongo.save_file(filename,request.files['file'])
  return redirect(url_for('get_upload',filename=filename))

@app.route('/files/<path:filename>',methods=['GET'])
def get_upload(filename):
  return mongo.send_file(filename)



#----------- Login -----------#
@app.route('/login',methods=['GET','POST'])
def login():
  error=None
  if request.method == 'POST':
    if request.form['username'] != 'admin' or request.form['password'] !='admin':
      error='invalid credential....'
    else:
      session['logged_in']=True
      flash('you are logged in...')
      redirect(url_for('event'))

  return "login"


@app.route('/logout')
def logout():
  session.pop('logged_in',None)
  flash('you are logged out....')
  return "sdfsd"

app.run(host='0.0.0.0',debug=True)
