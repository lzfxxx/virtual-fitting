# virtual-fitting

## Environment

```
node >= 4
python >= 2.7
```

## Code Style

https://github.com/airbnb/javascript

## Develop

### Pre-installs

First, You need to install MATLAB on your machine, and [install MATLAB Engine API for Python](http://www.mathworks.com/help/matlab/matlab_external/install-the-matlab-engine-for-python.html).

Then, the database MongoDB also need to be installed following [this page](https://docs.mongodb.com/manual/installation/), choose your system.

Then Python environment and npm packages need to be installed by running following commands in root folder:

```
pip install Flask flask-restful flask-pymongo PyMongo flask-httpauth itsdangerous werkzeug Pillow
```

```
npm install
```

### Every time before developing

Run following commands in separate terminal window under project root folder when developing:

```
cd assets/ && python simple-cors-http-server.py
```
```
npm start
```
```
cd server/ && python api.py
```
```
mongod
```
visit http://127.0.0.1:8989

## Build

```
npm run build
```
