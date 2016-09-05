/**
 * Created by zhaofengli on 05/09/2016.
 */
import React, { Component, PropTypes } from 'react';
import { message, Upload, Icon, Modal, Button } from 'antd';
import request from 'superagent';
import cookie from 'react-cookie';
import YouTube from 'react-youtube';

function getUsername() {
  if(window.u) {
    return window.u;
  }
  if(cookie.load('username')) {
    return cookie.load('username');
  }
}

// const username = getUsername();

class Vedio extends React.Component {
  render() {
    var height = '100%';
    if(this.props.height) {
      height = this.props.height;
    }
    const opts = {
      height: height,
      width: '100%',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 0
      }
    };

    return (
      <YouTube
        videoId="fsjkVFYYyLo"
        opts={opts}
        onReady={this._onReady}
      />
    );
  }

  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }
}

module.exports = Vedio;


/*

 <a href="https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png" target="_blank" className="upload-example">
 <img alt="example" src="https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png" />
 <span>Example</span>
 </a>
 */
