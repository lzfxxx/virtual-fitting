import React, { Component, PropTypes } from 'react';
import { Button } from 'antd';
import styles from './Start.less';
import fetch from 'isomorphic-fetch';
import 'es6-promise';


const URL = 'http://127.0.0.1:5000/';

class StartPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      world: "hehehe"
    };
  }

  componentDidMount() {
    var myHeaders = new Headers();

    var myInit = { method: 'GET',
      headers: myHeaders,
      mode: 'no-cors',
      cache: 'default' };
    //console.log(URL);

    // fetch(URL, myInit)
    //   .then(function(response) {
    //     if (response.status >= 400) {
    //       throw new Error("Bad response from server");
    //     }
    //     return response.json();
    //   })
    //   .then(function(stories) {
    //     console.log(stories);
    //   });
  }

  render() {
    return (
      <div className={styles.normal}>
        <div className={styles.container}>
          <h1 className={styles.title}>Fitting Room</h1>
          <p className={styles.desc}>A Virtual Fitting Room{this.state.world}</p>
          <a href="/Upload"><Button type="primary" style={{ marginTop: 5 }}>Getting Started</Button></a>
        </div>
      </div>
    );
  }
}

export default StartPage;
