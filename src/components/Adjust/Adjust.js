import React, {Component} from 'react';
import Cropper from 'react-cropper';
import styles from './Adjust.less';
import 'cropperjs/dist/cropper.css';
import { Icon, Modal, Button } from 'antd';
import request from 'superagent';
//import fs from 'fs';


const src = 'http://127.0.0.1:5000/user1/img1.jpg';

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

// function getCursorPosition(canvas, event) {
//   var rect = canvas.getBoundingClientRect();
//   var x = event.clientX - rect.left;
//   var y = event.clientY - rect.top;
//   console.log("x: " + x + " y: " + y);
//   console.log("hereeeeeeeeeee");
// }

class Copper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src,
      cropResult: src,
    };
    this._cropImage = this._cropImage.bind(this);
    this._onChange = this._onChange.bind(this);
    this._useDefaultImage = this._useDefaultImage.bind(this);
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

    request
      .post('http://127.0.0.1:5000/user1/img1.jpg')
      //.type('form')
      //.attach("image-file", image, 'user1_img1.jpg')
      .send(formData)
      .end((err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res.status);
          //console.log(res.text);
        }
      });
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

  _useDefaultImage() {
    this.setState({ src });
  }

  render() {
    return (
      <div className={styles.container}>
        <div style={{ width: '50%'}} className={styles.container2}>
          <Cropper
            style={{ height: 400, width: '80%' }}
            aspectRatio={1 / 1}
            preview=".img-preview"
            guides={false}
            src={this.state.src}
            ref="cropper"
            crop={this._crop}
          />
          <br />
          <Button type="ghost" onClick={ this._cropImage } style={{ float: 'right' }}>
            Crop Image
          </Button>
          <br />
          <Button type="ghost" onClick={ ()=>this._uploadImage() } style={{ float: 'right' }}>
            Upload
          </Button>
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
        </div>
      </div>
    );
  }
}

export default Copper;

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
