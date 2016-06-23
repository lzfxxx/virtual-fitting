import React, { Component, PropTypes } from 'react';

import { Upload, Icon, Modal } from 'antd';

import styles from './Upload.less';

class ImageUploadList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      priviewVisible: false,
      priviewImage: '',
    };
  }

  handleCancel() {
    this.setState({
      priviewVisible: false,
    });
    
    ///////////////////////////////////////////
    // request
    //   .put('http://127.0.0.1:5000/user1')
    //   .set('Content-Type', 'application/json')
    //   .send('{"img":"888888888888"}')
    //   .end(function(err, res){
    //     if (err) {
    //       console.log("Error!!!");
    //
    //     } else {
    //       console.log("Ok!!!");
    //
    //     }
    //   });
  }
  render() {
    const props = {
      action: '/upload.do',
      listType: 'picture-card',
      defaultFileList: [{
        uid: -1,
        name: 'xxx.png',
        status: 'done',
        url: 'https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png',
        thumbUrl: 'https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png',
      }],
      onPreview: (file) => {
        this.setState({
          priviewImage: file.url,
          priviewVisible: true,
        });
      },
    };
    return (
      <div className={styles.container}>
        <div className="clearfix">
          <Upload {...props}>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
          </Upload>
          <Modal visible={this.state.priviewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" src={this.state.priviewImage} />
          </Modal>
        </div>
      </div>
    );
  }
}

module.exports = ImageUploadList;


/*
 <a href="https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png" target="_blank" className="upload-example">
 <img alt="example" src="https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png" />
 <span>Example</span>
 </a>
 */
