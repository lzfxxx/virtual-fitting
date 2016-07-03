import React, { Component } from 'react';
import { Button, Form, Input } from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;
import styles from  './Signup.less';
import request from 'superagent';

const SEVER='http://127.0.0.1:5000/user/';

const ERROR = {"response": "ERROR"};
const EXISTS= {"response": "user already exists."};
const OK = {"response": "post ok"};
const NAMEMISS = {"response": "username missing"};



function noop() {
  return false;
}

let Signup = React.createClass({
  getInitialState() {
    return {
      exists: false,
      success: false,
    }
  },

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

      var data = {"username": values.name, "password": values.passwd, "img": "a photo"};
      request
        .post('http://127.0.0.1:5000/')
        .set('Content-Type', 'application/json')
        .send(data)
        .end((err, res) => {
          if (err) {
            console.log("Error!!!");

          } else {
            console.log(res.text);
            this.setState({success: true});
            // switch(res.text) {
            //   case ERROR: console.log("ERROR");
            //   case EXISTS:
            //   {
            //     this.setState({exists: true});
            //     console.log("exists");
            //   }
            //   case OK: console.log("POST OK");
            //   case NAMEMISS: console.log("username missing");
            //}
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
        if (this.state.exists) {
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

  renderSignup() {
    if(this.state.success === true) {
      return (
      <div className={styles.note}>
        <div>
          <Button type="primary" onClick={this.handleSubmit}>Confirm</Button>
          &nbsp;&nbsp;&nbsp;
          <Button type="ghost" onClick={this.handleReset}>Reset</Button>
        </div>
        <font size="2" color="darkgrey">Sign up success!!</font>
      </div>
      );
    }
    ///////////////////////////////////////////
    //add a username exist notification!!!!!!!
    ///////////////////////////////////////////
    return(
      <div >
        <Button type="primary" onClick={this.handleSubmit}>Confirm</Button>
        &nbsp;&nbsp;&nbsp;
        <Button type="ghost" onClick={this.handleReset}>Reset</Button>
      </div>);
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
          {this.renderSignup()}
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
