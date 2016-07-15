import React, { Component, PropTypes } from 'react';

import { Upload, Icon, Modal, Button } from 'antd';

import styles from './Upload.less';

//const URL1 = 'http://127.0.0.1:5000/' + window.u + '/img1.jpg';


const URL1 = 'http://127.0.0.1:5000/user1/img1.jpg';

class ImageUploadList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      priviewVisible: false,
      priviewImage: URL1+'?t='+new Date().getTime(),
      fileList: [{
        uid: -1,
        name: 'img1.jpg',
        status: 'done',
        url: URL1,
      }],
      x: 1,
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

  handleChange(info) {
    // let fileList = info.fileList;
    //
    // // 1. 上传列表数量的限制
    // //    只显示最近上传的一个，旧的会被新的顶掉
    // fileList = fileList.slice(-2);
    //
    // // 2. 读取远程路径并显示链接
    // fileList = fileList.map((file) => {
    //   if (file.response) {
    //     // 组件会将 file.url 作为链接进行展示
    //     file.url = file.response.url;
    //   }
    //   // file.url = URL1;
    //   return file;
    // });
    //
    // // 3. 按照服务器返回信息筛选成功上传的文件
    // fileList = fileList.filter((file) => {
    //   if (file.response) {
    //     return file.response.status === 'success';
    //   }
    //   return true;
    // });
    //
    // this.setState({ fileList });
    this.setState({
      priviewImage: URL1+'?t='+new Date().getTime(),
    });
    this.setState({
      x: this.state.x+1,
    });
    console.log(this.state.priviewImage);
  }

  render() {
    const props = {
      action: URL1,
      showUploadList: false,
      //listType: 'picture-card',
      onChange: (e) => this.handleChange(e),
      onPreview: (file) => {
        this.setState({
          priviewImage: file.url,
          priviewVisible: true,
        });
      },
    };
    return (
      <div className={styles.container}>
        <div className={styles.imgContainer}>
          <div className={styles.img}>
            <img className={styles.imgSelf} alt="img1" src={this.state.priviewImage} />
          </div>
          <div className={styles.upload}>
            <Upload {...props} fileList={this.state.fileList}>
              <Button type="ghost">
                <Icon type="upload" /> Upload
              </Button>
            </Upload>
            <Modal visible={this.state.priviewVisible} footer={null} onCancel={(e) => this.handleCancel(e)}>
              <img alt="example" src={this.state.priviewImage} />
            </Modal>
          </div>
        </div>
        <div className={styles.imgContainer}>
        </div>
        <div className={styles.imgContainer}>
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
