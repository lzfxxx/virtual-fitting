import React, { Component, PropTypes } from 'react';
import { message, Upload, Icon, Modal, Button } from 'antd';
import styles from './Upload.less';
import request from 'superagent';
import cookie from 'react-cookie';

const img1 = 'http://0.0.0.0:5500/admin/example2.jpg'+'?t='+new Date().getTime();
const img2 = 'http://0.0.0.0:5500/admin/example1.jpg'+'?t='+new Date().getTime();

// const img3 = 'http://0.0.0.0:5500/admin/example3.jpg'+'?t='+new Date().getTime();

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

class UploadPage extends Component {
  constructor(props) {
    super(props);
    this.username = getUsername();
    this.state = {
      URL1: 'http://0.0.0.0:5500/' + this.username + '/img1.jpg',
      URL2: 'http://0.0.0.0:5500/' + this.username + '/img2.jpg',
      // URL3: 'http://0.0.0.0:5500/' + this.props.params.username + '/img3.jpg'
    };
    window.key = '2';
  }

  render() {
    return (
      <div className={styles.container}>
        <ImageUpload image={img1} URL={this.state.URL1} text={'Upload your front photo'} border={1}/>
        <ImageUpload image={img2} URL={this.state.URL2} text={'Upload your side photo'}  border={1}/>
      </div>
    );
  }
}

class ImageUpload extends Component {

  constructor(props) {
    super(props);
    // var src = this.props.URL +'?t='+new Date().getTime();
    this.state = {
      priviewImage: this.props.image,
      iconLoading: false,
      isImg: "unknown",
      fileList: [{
        uid: -1,
        name: 'xxx.png',
        status: 'done',
        url: 'http://www.baidu.com/xxx.png',
      }]
    };
  }

  componentDidUpdate() {

  }

  componentDidMount() {
    request
      .get(this.props.URL)
      //.type('form')
      //.attach("image-file", image, 'user1_img1.jpg')
      .end((err, res) => {
        if (err) {
          console.log(err);
          this.setState({
            isImg: "false",
          });
        } else {
          console.log(res.status);
          this.setState({
            priviewImage: this.props.URL+'?t='+new Date().getTime(),
            isImg: "true",
          });
          //console.log(res.text);
        }
        setTimeout(this.hide, 0);
      });
  }

  getMessage() {
    // if(this.state.isImg === "unknown") {
    //   this.hide = message.loading('Loading Images...', 0);
    // }
    if(this.state.isImg === "true") {

    } else if(this.state.isImg === "false") {
      return "Please upload image";
    } else {
      this.hide = message.loading('Loading Images...', 0);
    }
  }
  handleChange(info) {
    let fileList = info.fileList;
    if(info.file.status == 'uploading') {
      if(!this.state.iconLoading) {
        this.setState({ iconLoading: true });
        this.hide2 = message.loading('Uploading...', 0);
        console.log("111");
      }
    }
    if(info.file.status == 'done') {
      this.setState({
        priviewImage: this.props.URL+'?t='+new Date().getTime(),
        iconLoading: false,
        isImg: true
      }, () => {
        // console.log(this.state.iconLoading);
        setTimeout(this.hide2, 0);
        message.success('Upload Succeed');
      });
    } else if(info.file.status === 'error') {
      this.setState({
        iconLoading: false
      });
      setTimeout(this.hide2, 0);
      message.error("Upload Failed");
    }
    this.setState({ fileList });
  }

  render() {
    const { URL } = this.props;
    const props = {
      action: URL,
      showUploadList: false,
      //listType: 'picture-card',
      onChange: (e) => this.handleChange(e),
    };
    return (
      <div className={styles.imgContainer} style={{borderWidth: this.props.border}}>
        {this.getMessage()}
        <div className={styles.img}>
          <img className={styles.imgSelf} alt="Please upload your image" src={this.state.priviewImage} />
        </div>
        <div className={styles.upload}>
          <Upload {...props} fileList={this.state.fileList} >
            <Button type="ghost"  icon="upload" loading={this.state.iconLoading}>
              {this.props.text}
            </Button>
          </Upload>
        </div>
      </div>
    );
  }
}

module.exports = UploadPage;


/*

 <a href="https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png" target="_blank" className="upload-example">
 <img alt="example" src="https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png" />
 <span>Example</span>
 </a>
 */
