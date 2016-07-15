import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import styles from './Mark.less';
import { Icon, Modal, Button } from 'antd';
import request from 'superagent';

var Mark = React.createClass({
  getInitialState: function(){
    return {
      mouseX: 500 /2,
      mouseY: 500/2,
      height: 500,
      width: 500
    };
  },
  mouseDown: function(event){
    event.preventDefault();
    this.setMousePosition(event);
    document.addEventListener('mousemove',this.mouseMove);
    document.addEventListener('mouseup',this.mouseUp);
  },
  mouseUp: function(event){
    document.removeEventListener('mousemove',this.mouseMove);
    document.removeEventListener('mouseup',this.mouseUp);
  },
  mouseMove: function(event){
    event.preventDefault();
    this.setMousePosition(event);
  },
  setMousePosition: function(event){
    var bounds = this.getCurrentBounds(event.clientX,event.clientY);
    if(bounds.mouseX < 0) {
      bounds.mouseX = 0;
    }
    if(bounds.mouseY < 0) {
      bounds.mouseY = 0;
    }
    if(bounds.mouseX > this.state.width) {
      bounds.mouseX = this.state.width;
    }
    if(bounds.mouseY > this.state.height) {
      bounds.mouseY = this.state.height;
    }
    this.setState({ mouseX: bounds.mouseX + this.elmOffset.left, mouseY: bounds.mouseY + this.elmOffset.top});
  },
  getCurrentBounds: function(clientX,clientY){
    this.elmOffset = ReactDOM.findDOMNode(this).getBoundingClientRect();
    var x = clientX - this.elmOffset.left;
    var y = clientY - this.elmOffset.top;
    return {
      mouseX: x,
      mouseY: y
    }
  },
  render: function(){
    var pointStyle = {
      top: this.state.mouseY,
      left: this.state.mouseX
    };
    return (
      <div className={styles.radial} onMouseDown={this.mouseDown}>
        <div className={styles.point} style={pointStyle}></div>
      </div>
    );
  }
});

export default Mark;
