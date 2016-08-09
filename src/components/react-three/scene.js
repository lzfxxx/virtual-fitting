import React, { Component, PropTypes } from 'react';
import {Scene, PerspectiveCamera, AmbientLight, DirectionalLight, Mesh} from 'react-three';
import THREE, {Vector3, Euler, Color, Quaternion} from 'three';
import Constants from '../constants';
import RobotRobbyComponent from './models/robotRobby';
// import RobotMechComponent from './models/robotMech';

import React3 from 'react-three-renderer';


const ROBOT_ROBBY_Y = -25;
// ROBOT_MECH_Y = 0;

class SceneComponent extends Component {

  constructor(props, context) {
    super(props, context);

    // construct the position vector here, because if we use 'new' within render,
    // React will think that things have changed when they have not.
    this.cameraPosition = new THREE.Vector3(0, 0, 5);

    this.state = {
      cubeRotation: new THREE.Euler(),
    };

    this._onAnimate = () => {
      // we will get this callback every frame

      // pretend cubeRotation is immutable.
      // this helps with updates and pure rendering.
      // React will be sure that the rotation has now updated.
      // this.setState({
      //   cubeRotation: new THREE.Euler(
      //     this.state.cubeRotation.x,
      //     this.state.cubeRotation.y + 0.1,
      //     0
      //   ),
      // });
    };
  }

  render() {
    const width = window.innerWidth; // canvas width
    const height = window.innerHeight; // canvas height

    return (<React3
      mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
      width={width}
      height={height}

      onAnimate={this._onAnimate}
    >
      <scene>
        <perspectiveCamera
          name="camera"
          fov={75}
          aspect={width / height}
          near={0.1}
          far={1000}

          position={this.cameraPosition}
        />
        <RobotRobbyComponent/>
      </scene>
    </React3>);
  }

}

export default SceneComponent;
