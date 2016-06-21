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
import styles from  './Menu.less';
import Login from '../Login/Login';

class Sider extends Component {

  constructor(props) {
    super(props);
    this.state = {
      current: '1',
      loading: false,
      visible: false,
    };
  }

  showModal() {
    console.log("adklsjadashdlahlajhfkhfkla");
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
  handleCancel() {
    this.setState({ visible: false });
  }

  handleClick(e) {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  }

  render() {
    const { children } = this.props;
    return (
      <div className={styles.aside}>
        <aside className={styles.sider}>
          <div className={styles.logo}></div>
          <Menu mode="inline" theme="light"
                defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']}>
            <SubMenu key="sub1"
                     title={<span>
                     <Icon type="user" />
                     <Link to="/">Fitting Room</Link><br />
                     </span>}
            >
              <Menu.Item key="1">
                <Link to="/start">1. Getting Started</Link><br />
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/upload">2. Upload Photos</Link><br />
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="/adjust">3. Adjust Photos</Link><br />
              </Menu.Item>
              <Menu.Item key="4">
                <Link to="/results">4. Results</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" title={<span><Icon type="user" /><Link to="/other">Other</Link></span>}>
              <Menu.Item key="5">
                <Link to="/1">1</Link><br />
              </Menu.Item>
              <Menu.Item key="6">
                <Link to="/2">2</Link><br />
              </Menu.Item>
              <Menu.Item key="7">
                <Link to="/3">3</Link><br />
              </Menu.Item>
              <Menu.Item key="8">
                <Link to="/4">4</Link><br />
              </Menu.Item>
            </SubMenu>
          </Menu>
        </aside>
        <div className={styles.main}>
          <div className={styles.header}>
            <Row type="flex" justify="space-around" align="middle"
                 className={styles.row}>
              <Col span={6}> </Col>
              <Col span={6}> </Col>
              <Col span={6} className={styles.col}>
                <Button type="ghost" icon="user" onClick={() => this.showModal()}>
                  Login
                </Button>
                <Modal ref="modal"
                       visible={this.state.visible}
                       title="Login" onOk={() => this.handleOk()} onCancel={() => this.handleCancel()}
                       footer={[
            <Button key="back" type="ghost" size="large" onClick={() => this.handleCancel()}>Cancel</Button>,
            <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={() => this.handleOk()}>
              Login
            </Button>,
          ]}
                >

                  <Login />
                </Modal>
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

Sider.propTypes = {
  children: PropTypes.any,
};

export default Sider;


