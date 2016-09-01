This folder stores local files for the programme.

In this development environment, it force load local files from development server. So when you need to read local files, you need a local web server, e.g. a python build-in server:

```
python -m SimpleHTTPServer 8888 &
```

If you're using Python 3+

```
python -m http.server 8888 &
```

However, here comes CORS problem, the browser limit you read files from different domain. So a [simple-cors-http-server](https://github.com/lzfxxx/virtual-fitting/blob/master/assets/simple-cors-http-server.py) is provided.

Make sure you are running this server, when you want to read local files in this folder. 

```
python simple-cors-http-server.py
```

When the server is running, just visit [http://localhost:8000/](http://localhost:8000/).