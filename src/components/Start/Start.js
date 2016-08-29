import React, { Component, PropTypes } from 'react';
import { Button } from 'antd';
import { Router, Route, IndexRoute, Link } from 'react-router';
import styles from './Start.less';
require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch';


const URL = 'http://127.0.0.1:5000/api';

class StartPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      world: "hehehe",
      //user: this.props.params.userId,
    };
    //window.u = this.props.params.userId;
    console.log(window.u);
  }

  componentDidMount() {
    var myHeaders = new Headers();

    // var myInit = { method: 'GET',
    //   headers: myHeaders,
    //   mode: 'no-cors',
    //   cache: 'default' };
    //console.log(URL);

    var data = {"a": "1"};

    // fetch(URL, {method: 'PUT',  body: JSON.stringify({
    //   name: 'Hubot',
    //   login: 'hubot',
    // })});
    //
    // fetch(URL, {method: 'GET'})
    //   .then((response) => response.json())
    //   .then((json) => {
    //     this.setState({world: json.response});
    //   });
    // console.log(this.state.user);
    // console.log(this.props.params);
  }

  render() {
    return (
      <div className={styles.normal}>
        <div className={styles.container}>
          <h1 className={styles.title}>A Virtual Fitting Room</h1>
          <p className={styles.desc}>Description</p>
          <p className={styles.desc}>DescriptionDescriptionDescriptionDescription</p>
          <p className={styles.desc}>DescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescription</p>
          <Link to={`/upload_${window.u}`}><Button type="primary" style={{ marginTop: 5 }}>Getting Started</Button></Link>
        </div>
      </div>
    );
  }
}

export default StartPage;
