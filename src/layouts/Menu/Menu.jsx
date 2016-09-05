import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link , browserHistory} from 'react-router';
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
import styles from './Menu.less';
import Login from '../Login/Login';
import Signup from '../Signup/Signup';
import cookie from 'react-cookie';

function getUsername() {
  if(window.u) {
    return window.u;
  }
  if(cookie.load('username')) {
    return cookie.load('username');
  }
}
// const username = getUsername();


class SiderPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      current: '1',
      loading: false,
      visible: false,
      signvisible: false,
      login: false,
      selectedKey: '1',
      username: window.u
    };
    this.username = getUsername();
    console.log(window.u,window.p);
    console.log(this.username);
    window.key = '1';
  }

  showModal() {
    cookie.remove('username');

    /** Clear all cookies starting with 'session' (to get all cookies, omit regex argument) */
    Object.keys(cookie.select(/^session.*/i)).forEach(name => cookie.remove(name));
    browserHistory.push('/index');
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

  changeKey() {
    console.log("11");
    if(window.key) {
      this.setState({selectedKey: window.key});
    }
  }

  render() {
    const { children } = this.props;
    return (
      <div className={styles.aside}>
        <aside className={styles.sider}>
          <div className={styles.logo}>

          </div>
          <Menu mode="inline" theme="light"
                defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']}>
            <SubMenu key="sub1"
                     title={<span>
                     <Icon type="user" />
                     <Link to="/">Fitting Room</Link><br />
                     </span>}
            >
              <Menu.Item key="1">
                <Link to="/">1. Get Started</Link><br />
              </Menu.Item>
              <Menu.Item key="2">
                <Link to={`/upload_${this.username}`}>2. Upload Photos</Link><br />
              </Menu.Item>
              <Menu.Item key="3">
                <Link to={`/adjust_${this.username}`}>3. Adjust Photos</Link><br />
              </Menu.Item>
              <Menu.Item key="4">
                <Link to={`/mark_${this.username}`}>4. Mark Key Points</Link><br />
              </Menu.Item>
              <Menu.Item key="5">
                <Link to={`/results_${this.username}`}>5. Results</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" title={<span><Icon type="user" /><Link to="/other">Tutorials</Link></span>}>
              <Menu.Item key="5">
                <Link to="/1">Full Demo</Link><br />
              </Menu.Item>
              <Menu.Item key="6">
                <Link to="/2">Registration and Login</Link><br />
              </Menu.Item>
              <Menu.Item key="7">
                <Link to="/3">Upload Photos</Link><br />
              </Menu.Item>
              <Menu.Item key="8">
                <Link to="/4">Adjust Photos</Link><br />
              </Menu.Item>
              <Menu.Item key="9">
                <Link to="/5">Mark Key Points</Link><br />
              </Menu.Item>
              <Menu.Item key="10">
                <Link to="/6">Results</Link><br />
              </Menu.Item>
            </SubMenu>
          </Menu>
        </aside>
        <div className={styles.main}>
          <div className={styles.header}>
            <Row type="flex" justify="space-around" align="middle"
                 className={styles.row}>
              <Col span={10} className={styles.col}> </Col>
              <Col span={10} className={styles.col}>
                <p style={{fontSize: 'large'}}>Welcome! {this.username} &nbsp;</p>
                <Button type="ghost" icon="logout" onClick={() => this.showModal()}>
                  Logout
                </Button>
              </Col>
            </Row>
          </div>
          <div className={styles.container}>
            <div className={styles.content}>
              <div style={{ height: 590, borderWidth: 3 }}>
                {children}
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

SiderPage.propTypes = {
  children: PropTypes.element.isRequired,
};

export default SiderPage;


