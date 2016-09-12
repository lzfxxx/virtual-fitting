import React, { Component, PropTypes } from 'react';
import { Button, Steps } from 'antd';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import styles from './Start.less';
require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch';
import cookie from 'react-cookie';
const Step = Steps.Step;

const URL = 'http://127.0.0.1:5000/api';
function getUsername() {
  if(window.u) {
    return window.u;
  }
  if(cookie.load('username')) {
    return cookie.load('username');
  }
}


class StartPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      world: "hehehe",
      //user: this.props.params.userId,
    };
    this.username = getUsername();
    console.log("usernamethis", this.username);
    //window.u = this.props.params.userId;
    console.log(window.u);
    console.log("username", this.username);
    /////////////////////////////////////////////////////////////////////////////////////////////////
    //check token, if fail, remind to login and go back to index

  }

  push() {
    window.key = '2';
    browserHistory.push('/upload_'+getUsername());
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
          <h1 className={styles.title}>What to Do</h1>
          <br />
          <br />
          <div className={styles.container2}>
            <div style={{flex: 1, textAlign: 'left'}}>
              <b style={{fontSize: 15}}>1.&nbsp;&nbsp;&nbsp;Upload</b><br /><br />
              <Steps direction="vertical" size="small">
                <Step title="Press Upload" description="Press left button on the page" status={"process"}/>
                <Step title="Choose Front" description="Choose one of your front photos" status={"process"}/>
                <Step title="Press Upload" description="Press right button on the page" status={"process"}/>
                <Step title="Choose Side" description="Choose one of your side photos" status={"process"}/>
              </Steps>
            </div>
            <div style={{flex: 1, textAlign: 'left'}}>
              <b style={{fontSize: 15}}>2.&nbsp;&nbsp;&nbsp;Adjust</b><br /><br />
              <Steps direction="vertical" size="small" current={0}>
                <Step title="Crop Front" description="Crop your front photo in the cropper" status={"process"}/>
                <Step title="Confirm Front" description="Press crop and confirm after finishing" status={"process"}/>
                <Step title="Crop Side" description="Crop your side photo in the cropper" status={"process"}/>
                <Step title="Confirm Side" description="Press crop and confirm after finishing" status={"process"}/>
              </Steps>
            </div>
            <div style={{flex: 1, textAlign: 'left'}}>
              <b style={{fontSize: 15}}>3.&nbsp;&nbsp;&nbsp;Mark</b><br /><br />
              <Steps direction="vertical" size="small" current={0}>
                <Step title="Mark Front" description="Drag points to mark your front photo" status={"process"}/>
                <Step title="Confirm Front" description="Press confirm button" status={"process"}/>
                <Step title="Mark Side" description="Drag points to mark your side photo" status={"process"}/>
                <Step title="Confirm Side" description="Input your height and confirm" status={"process"}/>
              </Steps>
            </div>
            <div style={{flex: 1, textAlign: 'left'}}>
              <b style={{fontSize: 15}}>4.&nbsp;&nbsp;&nbsp;Results</b><br /><br />
              <Steps direction="vertical" size="small" current={0}>
                <Step title="Results" description="The 3D models shows your body and clothes" status={"process"}/>
                <Step title="Fitting Cloth" description="Choose different cloth size to fitting" status={"process"}/>
              </Steps>
            </div>
          </div>
          <br />
          <br />
          <Button type="primary" style={{ marginTop: 5 }} onClick={() => this.push()}>Getting Started</Button>
        </div>
      </div>
    );
  }
}

export default StartPage;
