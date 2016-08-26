import React, { Component, PropTypes } from 'react';
import { message, Upload, Icon, Modal, Button } from 'antd';
import styles from './Upload.less';
import request from 'superagent';

const img1 = 'http://0.0.0.0:5500/admin/example1.jpg'+'?t='+new Date().getTime();
const img2 = 'http://0.0.0.0:5500/admin/example2.jpg'+'?t='+new Date().getTime();
// const img3 = 'http://0.0.0.0:5500/admin/example3.jpg'+'?t='+new Date().getTime();

// const URL1 = 'http://0.0.0.0:5000/' + window.u + '/img1.jpg';
// const URL2 = 'http://0.0.0.0:5000/' + window.u + '/img2.jpg';
// const URL3 = 'http://0.0.0.0:5000/' + window.u + '/img3.jpg';

// const URL1 = 'http://0.0.0.0:5000/' + 'user1' + '/img1.jpg';
// const URL2 = 'http://0.0.0.0:5000/' + 'user1' + '/img2.jpg';
// const URL3 = 'http://0.0.0.0:5000/' + 'user1' + '/img3.jpg';


class UploadPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      URL1: 'http://0.0.0.0:5500/' + this.props.params.username + '/img1.jpg',
      URL2: 'http://0.0.0.0:5500/' + this.props.params.username + '/img2.jpg',
      // URL3: 'http://0.0.0.0:5500/' + this.props.params.username + '/img3.jpg'
    };
  }

  render() {
    return (
      <div className={styles.container}>
        <ImageUploadList image={img2} URL={this.state.URL1} text={'Upload your front photo'} border={1}/>
        <ImageUploadList image={img1} URL={this.state.URL2} text={'Upload your side photo'}  border={1}/>
      </div>
    );
  }
}

class ImageUploadList extends Component {

  constructor(props) {
    super(props);
    // var src = this.props.URL +'?t='+new Date().getTime();
    this.state = {
      priviewImage: this.props.image,
      iconLoading: false,
      isImg: "unknown"
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
      });
    setTimeout(this.hide, 0);
  }

  getMessage() {
    // if(this.state.isImg === "unknown") {
    //   this.hide = message.loading('Loading Images...', 0);
    // }
    if(this.state.isImg === "true") {
      return
    } else if(this.state.isImg === "false") {
      return "Please upload image"
    } else {
      this.hide = message.loading('Loading Images...', 0);
    }
  }
  enterLoading() {
    this.setState({ iconLoading: true });
    this.hide = message.loading('Uploading...', 0);
  }
  handleChange(info) {
    if (info.file.status === 'done') {
      this.setState({
        priviewImage: this.props.URL+'?t='+new Date().getTime(),
        iconLoading: false
      }, () => {
        console.log(this.state.iconLoading);
        setTimeout(this.hide, 0);
        message.success('Upload Succeed');
      });
    } else if (info.file.status === 'error') {
      setTimeout(this.hide, 0);
      message.error("Upload Failed");
    }
  }

  render() {
    const props = {
      action: this.props.URL,
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
            <Button type="ghost"  icon="upload" loading={this.state.iconLoading} onClick={() => this.enterLoading()}>
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
