import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import THREE from 'three';
import ReactTHREE from 'react-three';
// import ControlsComponent from './controls';
import SceneComponent from './scene';
import Constants from '../constants';

class App extends Component {

  constructor() {

    super();

    this.state = {
      robot: Constants.ROBOT.ROBBY,
      spinDirection: Constants.SPIN.LEFT,
      spinSpeed: Constants.SPIN_SPEED_DEFAULT
    };

    this._onChangeRobot = this._onChangeRobot.bind(this);
    this._onChangeSpinDirection = this._onChangeSpinDirection.bind(this);
    this._onChangeSpinSpeed = this._onChangeSpinSpeed.bind(this);

  }

  render() {

    // console.log(SceneComponent);

    return (
      <div>
          <SceneComponent robot={this.state.robot} spinDirection={this.state.spinDirection} spinSpeed={this.state.spinSpeed}/>
      </div>
    );

  }

  _onChangeRobot(robotName) {
    this.setState({robot: robotName});
  }

  _onChangeSpinDirection(spinDirection) {
    this.setState({spinDirection: spinDirection});
  }

  _onChangeSpinSpeed(spinSpeed) {
    this.setState({spinSpeed: spinSpeed});
  }

}

export default App;

/*
 <ControlsComponent robot={this.state.robot} spinDirection={this.state.spinDirection} spinSpeed={this.state.spinSpeed} onChangeRobot={this._onChangeRobot} onChangeSpinDirection={this._onChangeSpinDirection} onChangeSpinSpeed={this._onChangeSpinSpeed}/>

 */
