import React, {Component} from 'react';
import Cropper from 'react-cropper';
import styles from './Adjust.less';
import 'cropperjs/dist/cropper.css';
import { Icon, Modal, Button, Tabs,message} from 'antd';
import request from 'superagent';
import cookie from 'react-cookie';

//import fs from 'fs';

const TabPane = Tabs.TabPane;

// const URL1 = 'http://0.0.0.0:5000/' + window.u + '/img1.jpg';
// const URL2 = 'http://0.0.0.0:5000/' + window.u + '/img2.jpg';
// const URL3 = 'http://0.0.0.0:5000/' + window.u + '/img3.jpg';

// const URL1 = 'http://0.0.0.0:5000/' + 'user1' + '/img1.jpg';
// const URL2 = 'http://0.0.0.0:5000/' + 'user1' + '/img2.jpg';
// const URL3 = 'http://0.0.0.0:5000/' + 'user1' + '/img3.jpg';
function getUsername() {
  if(window.u) {
    return window.u;
  }
  if(cookie.load('username')) {
    return cookie.load('username');
  }
}

// const username = getUsername();


function base64ToBlob(base64, mime)
{
  mime = mime || '';
  var sliceSize = 1024;
  var byteChars = window.atob(base64);
  var byteArrays = [];

  for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
    var slice = byteChars.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, {type: mime});
}

class CropperPage extends Component {
  constructor(props) {
    super(props);
    this.username = getUsername();
    this.state = {
      URL1: 'http://0.0.0.0:5000/' + this.username + '/img1.jpg',
      URL2: 'http://0.0.0.0:5000/' + this.username + '/img2.jpg',
      // URL3: 'http://0.0.0.0:5000/' + this.props.params.username + '/img3.jpg'
    };
  }

  render() {
    function callback(key) {
      console.log(key);
    }

    return (
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="Front Photo" key="1" className={styles.tab}>
          <MyCropper URL={this.state.URL1}/>
        </TabPane>
        <TabPane tab="Side Photo" key="2" className={styles.tab}>
          <MyCropper URL={this.state.URL2}/>
        </TabPane>
      </Tabs>
    );
  }
}

// function getCursorPosition(canvas, event) {
//   var rect = canvas.getBoundingClientRect();
//   var x = event.clientX - rect.left;
//   var y = event.clientY - rect.top;
//   console.log("x: " + x + " y: " + y);
//   console.log("hereeeeeeeeeee");
// }

class MyCropper extends Component {
  constructor(props) {
    super(props);
    var s = this.props.URL+'?t='+new Date().getTime();
    const src = this.props.URL;
    this.state = {
      src,
      cropResult: s,
      iconLoading: false,
      isImg: "unknown"
    };
    this._cropImage = this._cropImage.bind(this);
    this._onChange = this._onChange.bind(this);
    //this._useDefaultImage = this._useDefaultImage.bind(this);
    this.hide = message.loading('Loading Images...', 1);
  }

  componentDidMount() {

  }

  _cropImage() {
    if (typeof this.refs.cropper.getCroppedCanvas() === 'undefined') {
      return;
    }
    this.setState({
      cropResult: this.refs.cropper.getCroppedCanvas().toDataURL(),
    });
  }

  _uploadImage() {
    // var img;
    // request
    //   .get(src)
    //   .set('Content-Type', 'application/json')
    //   .end((err, res) => {
    //     img=res
    //     console.log("kkkkkkkkkkkkkkk"+img);
    //   });

    // var image = new Image();
    // image.src = this.state.cropResult;


    var image = this.state.cropResult;
    var base64ImageContent = image.replace(/^data:image\/(png|jpg);base64,/, "");
    var blob = base64ToBlob(base64ImageContent, 'image/png');
    var formData = new FormData();
    formData.append('file', blob);

    //console.log(formData);
    //console.log(this.state.cropResult);

    // var data = this.state.cropResult.replace(/^data:image\/\w+;base64,/, "");
    // var buf = new Buffer(data, 'base64');
    // fs.writeFile('../../img/img1.jpg', buf);

    // var bitmap = new Buffer(this.state.cropResult, 'base64');
    // fs.writeFileSync('../../img/img1.jpg', bitmap);
    this.setState({ iconLoading: true });
    this.hide = message.loading('Uploading...', 0);
    request
      .post(this.props.URL)
      //.type('form')
      //.attach("image-file", image, 'user1_img1.jpg')
      .send(formData)
      .end((err, res) => {
        if (err) {
          console.log(err);
          message.error("Upload Failed");

        } else {
          console.log(res.status);
          if(res.status='200') {
            message.success('Upload Succeed');

          }
          //console.log(res.text);
        }
      });
    this.setState({
      iconLoading: false
    }, () => {
      setTimeout(this.hide, 0);
    });
  }
  getMessage() {
    // if(this.state.isImg === "unknown") {
    //   this.hide = message.loading('Loading Images...', 0);
    // }
    if(this.state.isImg === "true") {
      return
    } else if(this.state.isImg === "false") {
      message.error('Loading Failed');
    } else {
      this.hide = message.loading('Loading Images...', 0);
    }
  }

  _onChange(e) {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.setState({ src: reader.result });
    };
    reader.readAsDataURL(files[0]);
  }

  // _useDefaultImage() {
  //   this.setState({ src });
  // }

  render() {
    // this.getMessage();
    return (
      <div className={styles.container}>
        <div style={{ width: '50%'}} className={styles.container2}>
          <Cropper
            style={{
              //width: '100%',
              //height: '100%',
              //objectFit: 'contain'
              height: '80%', width: '80%'
            }}
            aspectRatio={1 / 1}
            preview=".img-preview"
            guides={false}
            src={this.state.src}
            ref="cropper"
            crop={this._crop}
          />
          <br />
          <br />
          <Button type="ghost" onClick={ this._cropImage } style={{ float: 'right' }}>
            Crop Image
          </Button>
          <br />
        </div>

        <div className={styles.container2}>
          <div style={{ width: '100%', float: 'right' ,height: '100%'}} className={styles.container3}>
            <h1 style={{ display: 'inline-block' }}>
              Preview
            </h1>
            <br />
            <br />
            <img
              className={styles.img}
              style={{
            width: '70%'
            //height: 400
            }} src={this.state.cropResult} />
          </div>
          <div style={{ width: '100%', float: 'right' ,height: '100%'}} className={styles.container4}>
            <Button type="ghost" icon="upload" loading={this.state.iconLoading} onClick={ ()=>this._uploadImage() } style={{ float: 'right' }}>
              Upload
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default CropperPage;

/*
 <input type="file" onChange={this._onChange} />
 <button onClick={this._useDefaultImage}>Use default img</button>
 <br />
 <br />



 <div className={styles.container2}>
 <div className="box" style={{ width: '50%', float: 'right', height: '50%'}} className={styles.container3}>
 <h1>Preview</h1>
 <div className="img-preview" style={{ width: '100%', float: 'left', height: 100 }} />
 </div>
 <div className="box" style={{ width: '50%', float: 'right' ,height: '50%'}} className={styles.container3}>
 <h1 style={{ display: 'inline-block' }}>
 Crop
 <button onClick={ this._cropImage } style={{ float: 'right' }}>
 Crop Image
 </button>
 </h1>
 <img style={{ width: '100%' }} src={this.state.cropResult} />
 </div>
 </div>
 <br style={{ clear: 'both' }} />
 */
