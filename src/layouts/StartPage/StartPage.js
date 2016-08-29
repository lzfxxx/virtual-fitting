import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import {
  Menu,
  Breadcrumb,
  Icon,
  Row,
  Col,
  Button,
  Modal,
  Input,
} from 'antd';
const SubMenu = Menu.SubMenu;
import styles from './StartPage.less';
import Login from '../Login/Login';
import Signup from '../Signup/Signup';

class Sider extends Component {

  constructor(props) {
    super(props);
    this.state = {
      current: '1',
      loading: false,
      visible: false,
      signvisible: false,
      login: false,
    };
  }

  showModal() {
    this.setState({
      visible: true,
    });
  }

  handleOk() {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  }
  showSign() {
    this.setState({
      visible: false,
      signvisible: true,
    });
  }
  handleCancel() {
    this.setState({
      visible: false,
      signvisible: false,
    });
  }

  handleClick(e) {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  }


  renderHeader() {
    return (
      <div className={styles.header}>
        <Row type="flex" justify="space-around" align="middle"
             className={styles.row}>
          <Col span={6} className={styles.logocol}>
            <div className={styles.logo}></div>
          </Col>
          <Col span={6}> </Col>

          <Col span={6} className={styles.col}>
            <Button type="ghost" icon="user" onClick={() => this.showModal()}>
              Login
            </Button>
            <Modal ref="modal1"
                   visible={this.state.visible}
                   title="Login" onOk={() => this.handleOk()} onCancel={() => this.handleCancel()}
                   footer={[

                     <font size="2" color="darkgrey">Don't have a account?  </font>,
                     <Button key="back" type="ghost" size="large" onClick={() => this.showSign()}>Sign up</Button>,


                   ]}
            >
              <Login />
            </Modal>
            <Modal ref="modal2"
                   visible={this.state.signvisible}
                   title="Sign up" onOk={() => this.handleOk()} onCancel={() => this.handleCancel()}
                   footer={[

                     <Button key="back" type="ghost" size="large" onClick={() => this.handleCancel()}>Cancel</Button>,

                   ]}
            >
              <Signup />
            </Modal>
          </Col>

        </Row>
      </div>);
  }

  render() {
    //const { children } = this.props;
    return (
      <div className={styles.aside}>
        <div className={styles.main}>
          {this.renderHeader()}
          <div className={styles.container}>
            <div className={styles.content}>
              <div style={{ height: 590, borderWidth: 3 }}>
                <div className={styles.normal}>
                  <div className={styles.container_s}>
                    <h1 className={styles.title}>Fitting Room</h1>
                    <p className={styles.desc}>A Virtual Fitting Room</p>
                    <Button type="primary" style={{ marginTop: 5 }} onClick={() => this.showModal()}>Getting Started</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.footer}>
            © 2016 Imperial College London Doc.
          </div>
        </div>
      </div>
    );
  }
}

Sider.propTypes = {
  children: PropTypes.any,
};

export default Sider;


