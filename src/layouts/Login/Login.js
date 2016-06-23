import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import { Form, Input, Button, Checkbox } from 'antd';
import request from 'superagent';

const FormItem = Form.Item;
let Login = React.createClass({
  getInitialState() {
    return {
      loged: false,
      error: false,
    }
  },

  handleSubmit(e) {
    e.preventDefault();
    console.log('Received Form Value：', this.props.form.getFieldsValue());
    var username = this.props.form.getFieldsValue().userName;
    var password = this.props.form.getFieldsValue().password;


    var loged = false;
    var error = false;

    //get by superagent and flask
    request
      .get('http://127.0.0.1:5000/user/')
     //.withCredentials()
      .auth(username, password)
      .end(function(err, res){
        if (err) {
          console.log("Error!!!");
          loged = false;
          error = true;
        } else {
          console.log(res);
          loged = true;
          error = false;
          console.log("link");
          browserHistory.push('/start');
        }
      });


    //request by 'request' with EVE
    // var options = {
    //   url: 'http://127.0.0.1:5000/user/',
    //   method: 'GET',
    //   auth: {
    //     user: username,
    //     password: password
    //   }
    // };
    // request(options, function(err, res, body) {
    //   if (err) {
    //     console.log("Error!!!");
    //     loged = false;
    //     error = true;
    //   } else {
    //     console.log(body);
    //     loged = true;
    //     error = false;
    //     console.log("link");
    //     browserHistory.push('/start');
    //   }
    //   //var result = JSON.parse(body)
    // });


    

    //request by 'request' with Flask_restful
    // request(
    //   { method: 'PUT',
    //     uri: 'http://127.0.0.1:5000/user1',
    //     body: JSON.stringify({img: "88888888888888"})
    //   }
    //   , function (error, response, body) {
    //     if(response.statusCode == 201){
    //       console.log('document saved')
    //     } else {
    //       console.log('error: '+ response.statusCode)
    //       console.log(body)
    //     }
    //   }
    // );
    console.log(loged,error);
    this.setState({loged: loged, error: error});
  },

  renderLogin() {


    if(this.state.error === true) {
      return (
        <div >
          <Button type="primary" htmlType="submit">Login</Button>
          <font size="2" color="darkgrey">Incorrect username or password!</font>
        </div>);
    }
    console.log("nolink");
    return <Button type="primary" htmlType="submit">Login</Button>
  },


  render() {
    const { getFieldProps } = this.props.form;
    return (
      <Form horizontal onSubmit={(e) => this.handleSubmit(e)}>
        <FormItem
          label="Username"
        >
          <Input placeholder="Please enter your username"
            {...getFieldProps('userName')}
          />
        </FormItem>
        <FormItem
          label="Password"
        >
          <Input type="password" placeholder="Please enter your password"
            {...getFieldProps('password')}
          />
        </FormItem>
        <FormItem>
          <Checkbox {...getFieldProps('agreement')}>Remember Me</Checkbox>
        </FormItem>
        {this.renderLogin()}
      </Form>
    );
  },
});

Login = Form.create()(Login);


export default Login;
