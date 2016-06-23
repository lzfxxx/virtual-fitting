import React, { Component } from 'react';
import { Button, Form, Input } from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;
import request from 'superagent';

const SEVER='http://127.0.0.1:5000/user/';

function noop() {
  return false;
}

let Signup = React.createClass({
  handleReset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }
      console.log('Submit!!!');

      var data = {"username": values.name, "password": values.passwd, "img": "a photo"};
      request
        .post('http://127.0.0.1:5000/')
        .set('Content-Type', 'application/json')
        .send(data)
        .end(function(err, res){
          if (err) {
            console.log("Error!!!");

          } else {
            console.log("Ok!!!");

          }
        });

      console.log(values);
    });
  },

  userExists(rule, value, callback) {
    if (!value) {
      callback();
    } else {
      setTimeout(() => {
        if (value === 'JasonWood') {
          callback([new Error('Sorry, this username was taken')]);
        } else {
          callback();
        }
      }, 800);
    }
  },

  checkPass(rule, value, callback) {
    const { validateFields } = this.props.form;
    if (value) {
      validateFields(['rePasswd'], { force: true });
    }
    callback();
  },

  checkPass2(rule, value, callback) {
    const { getFieldValue } = this.props.form;
    if (value && value !== getFieldValue('passwd')) {
      callback('Different passwords!');
    } else {
      callback();
    }
  },

  render() {
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
    const nameProps = getFieldProps('name', {
      rules: [
        { required: true, min: 5, message: 'At least 5 characters' },
        { validator: this.userExists },
      ],
    });
    // const emailProps = getFieldProps('email', {
    //   validate: [{
    //     rules: [
    //       { required: true },
    //     ],
    //     trigger: 'onBlur',
    //   }, {
    //     rules: [
    //       { type: 'email', message: 'Please enter correct email' },
    //     ],
    //     trigger: ['onBlur', 'onChange'],
    //   }],
    // });
    const passwdProps = getFieldProps('passwd', {
      rules: [
        { required: true, whitespace: true, message: 'Please enter password' },
        { validator: this.checkPass },
      ],
    });
    const rePasswdProps = getFieldProps('rePasswd', {
      rules: [{
        required: true,
        whitespace: true,
        message: 'Please enter password again',
      }, {
        validator: this.checkPass2,
      }],
    });
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };
    return (
      <Form horizontal form={this.props.form}>
        <FormItem
          {...formItemLayout}
          label="Username"
          hasFeedback
          help={isFieldValidating('name') ? 'checking...' : (getFieldError('name') || []).join(', ')}
        >
          <Input {...nameProps} placeholder="Please enter your username" />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Password"
          hasFeedback
        >
          <Input {...passwdProps} type="password" autoComplete="off" placeholder="Please enter your password"
                                  onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
          />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Confirm password"
          hasFeedback
        >
          <Input {...rePasswdProps} type="password" autoComplete="off" placeholder="Please keep the passwords same"
                                    onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
          />
        </FormItem>

        <FormItem wrapperCol={{ span: 12, offset: 7 }}>
          <Button type="primary" onClick={this.handleSubmit}>Confirm</Button>
          &nbsp;&nbsp;&nbsp;
          <Button type="ghost" onClick={this.handleReset}>Reset</Button>
        </FormItem>
      </Form>
    );
  },
});

Signup = createForm()(Signup);

export default Signup;

/*
 <FormItem
 {...formItemLayout}
 label="Email"
 hasFeedback
 >
 <Input {...emailProps} type="email" placeholder="Please enter your email" />
 </FormItem>
 */
