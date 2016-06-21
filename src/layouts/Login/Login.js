import React, { Component, PropTypes } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;

let Login = React.createClass({
  handleSubmit(e) {
    e.preventDefault();
    console.log('Received Form Value：', this.props.form.getFieldsValue());
  },

  render() {
    const { getFieldProps } = this.props.form;
    return (
      <Form horizontal onSubmit={this.handleSubmit}>
        <FormItem
          label="Username"
        >
          <Input placeholder="Please input your username"
            {...getFieldProps('userName')}
          />
        </FormItem>
        <FormItem
          label="Password"
        >
          <Input type="password" placeholder="Please input your password"
            {...getFieldProps('password')}
          />
        </FormItem>
        <FormItem>
          <Checkbox {...getFieldProps('agreement')}>Remember Me</Checkbox>
        </FormItem>
       
      </Form>
    );
  },
});

Login = Form.create()(Login);


export default Login;
