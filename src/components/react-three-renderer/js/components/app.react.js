import THREE from 'three';
import React from 'react';
import SettingsStore from '../stores/settings_store';
import Scene3D from './three/scene.react';
import World from './three/world.react';
import Model from './three/model.react';
import Waist from './three/waist.react';
import Stats from './stats.react';

import React3 from 'react-three-renderer';

import StaticWorld from './three/Cloth/StaticWorld';
import Cloth from './three/Cloth/Cloth';


/* main react component, the only component with state */

const ballSize = 60; // 40

const GRAVITY = 981 * 1.4; //
const gravity = new THREE.Vector3(0, -GRAVITY, 0).multiplyScalar(Cloth.MASS);

const TIMESTEP = 18 / 1000;
const TIMESTEP_SQ = TIMESTEP * TIMESTEP;

const diff = new THREE.Vector3();

function satisfyConstrains(p1, p2, distance) {
  diff.subVectors(p2.position, p1.position);
  const currentDist = diff.length();
  if (currentDist === 0) return; // prevents division by 0
  const correction = diff.multiplyScalar(1 - distance / currentDist);
  const correctionHalf = correction.multiplyScalar(0.5);
  p1.position.add(correctionHalf);
  p2.position.sub(correctionHalf);
}

const tmpForce = new THREE.Vector3();


class App extends React.Component{

  static displayName = 'App';

  constructor(props){
    super(props);
    this.state = SettingsStore.getSettings();

    this.state = {
      ...this.state,
      minTimePerFrame: 0,
      rotate: false,
      wind: true,
      sphere: false,
    };

    this.onChangeListener = this.onChange.bind(this);

    const xSegs = SettingsStore.xSegs; //
    const ySegs = SettingsStore.ySegs; //

    this.cloth = new Cloth(xSegs, ySegs);

    const pinsFormation = [];
    let pins = [6];

    pinsFormation.push(pins);

    pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    pinsFormation.push(pins);

    pins = [0];
    pinsFormation.push(pins);

    pins = []; // cut the rope ;)
    pinsFormation.push(pins);

    pins = [0, this.cloth.w]; // classic 2 pins
    pinsFormation.push(pins);

    let i;
    for(i = 0; i <= this.cloth.w; i++) {
      pins.push(i);
    }
    pinsFormation.push(pins);

    pins = pinsFormation[5];

    this.pins = pins;
    this.pinsFormation = pinsFormation;

    this.fog = new THREE.Fog(0xcce0ff, 500, 10000);

    this.windForce = new THREE.Vector3(0, 0, 0);

    this.state = {
      ...this.state,
      ballPosition: new THREE.Vector3(0, -45, 0),
      cameraPosition: new THREE.Vector3(0, 50, 150),
    };

    this.scenePosition = new THREE.Vector3(0, 0, 0);
  }

  // componentDidMount() {
  //   SettingsStore.addChangeListener(this.onChangeListener);
  //   window.addEventListener('resize', this.onChangeListener);
  // }
  //
  // componentWillUnmount() {
  //   SettingsStore.removeChangeListener(this.onChangeListener);
  //   window.removeEventListener('resize', this.onChangeListener);
  // }

  // Determine whether point P in triangle ABC
  pointInTriangle(A, B, C, P) {

    const v0 = new THREE.Vector3();
    const v1 = new THREE.Vector3();
    const v2 = new THREE.Vector3();

    v0.subVectors(C, A);
    v1.subVectors(B, A);
    v2.subVectors(P, A);

    let dot00 = v0.dot(v0);
    let dot01 = v0.dot(v1);
    let dot02 = v0.dot(v2);
    let dot11 = v1.dot(v1);
    let dot12 = v1.dot(v2);

    let inverDeno = 1 / (dot00 * dot11 - dot01 * dot01) ;

    let u = (dot11 * dot02 - dot01 * dot12) * inverDeno ;
    if (u < 0 || u > 1) // if u out of range, return directly
    {
      return false;
    }

    let v = (dot00 * dot12 - dot01 * dot02) * inverDeno ;
    if (v < 0 || v > 1) // if v out of range, return directly
    {
      return false;
    }

    return u + v <= 1;
  }

  onChange(){
    let state = SettingsStore.getSettings();
    this.setState(state);
  }

  _simulate(time) {
    if (!this.lastTime) {
      this.lastTime = time;
      return;
    }

    let i;
    let il;
    let particles;
    let particle;
    let constrains;
    let constrain;

    const clothGeometry = React3.findTHREEObject(this._clothGeometry);

    // const sphere = React3.findTHREEObject(this.refs.sphere);

    // Aerodynamics forces
    if (this.state.wind) {
      let face;
      const faces = clothGeometry.faces;
      let normal;

      particles = this.cloth.particles;

      for (i = 0, il = faces.length; i < il; i++) {
        face = faces[i];
        normal = face.normal;

        tmpForce.copy(normal).normalize().multiplyScalar(normal.dot(this.windForce));
        particles[face.a].addForce(tmpForce);
        particles[face.b].addForce(tmpForce);
        particles[face.c].addForce(tmpForce);
      }
    }

    for (particles = this.cloth.particles, i = 0, il = particles.length; i < il; i++) {
      particle = particles[i];
      particle.addForce(gravity);

      particle.integrate(TIMESTEP_SQ);
    }

    // Start Constrains

    constrains = this.cloth.constrains;
    il = constrains.length;

    for (i = 0; i < il; i++) {
      constrain = constrains[i];
      satisfyConstrains(constrain[0], constrain[1], constrain[2]);
    }

    let geometries = this.state.parsedModel.geometries;
    const uuid = "5405FFA6-5372-3096-BA9C-F7443661FF59";
    // const uuid = "03A99801-89ED-3205-9CCE-582517865AEC";
    let geometry = geometries.get(uuid);
    // console.log('first geometry');
    // console.log(geometry);
    // console.log(this.cloth.particles);

    for (particles = this.cloth.particles,
           i = 0,
           il = particles.length; i < il; i++) {
      particle = particles[i];
      const pos = particle.position;

      // var bodyPositions = geometry.vertices;
      // bodyPositions.forEach(e => {
      //   var a = new THREE.Vector3(e.x*5, e.z*5 - 34, e.y*5);
      //   diff.subVectors(pos, a);
      //   if(diff.length() < 10) {
      //     console.log("111111");
      //     diff.normalize().multiplyScalar(10);
      //     pos.copy(a).add(diff);
      //   }
      // });

      // let cubePosition = new THREE.Vector3(0, -34, 0);//(x, z, y)
      //diff.subVectors(pos, cubePosition);

      geometry.faces.forEach(face => {
        let A = new THREE.Vector3();
        let B = new THREE.Vector3();
        let C = new THREE.Vector3();
        A.copy(geometry.vertices[face.a]).multiplyScalar(1);
        B.copy(geometry.vertices[face.b]).multiplyScalar(1);
        C.copy(geometry.vertices[face.c]).multiplyScalar(1);

        if(this.pointInTriangle(A, B, C, pos)) {
          //console.log('in');
          particle.position.copy(particle.previous);
          particle.previous.copy(particle.previous);
          // diff.normalize().multiplyScalar(diff.length());
          // pos.copy(cubePosition).add(diff);
        }
      });

      // let ballSize = [10, 10, 10];
      // const ballPosition = new THREE.Vector3(0, 10, 0);//(x, z, y)
      // diff.subVectors(pos, ballPosition);
      // if (diff.length() < ballSize[0]) {
      //   // collided
      //   diff.normalize().multiplyScalar(ballSize[0]);
      //   pos.copy(ballPosition).add(diff);
      // }
      //
      // // let ballSize2 = 20;
      // let diff2 = new THREE.Vector3();
      // const ballPosition2 = new THREE.Vector3(0, -20, 0);//(x, z, y)
      // diff2.subVectors(pos, ballPosition2);
      // if (diff2.length() < ballSize[1]) {
      //   // collided
      //   diff2.normalize().multiplyScalar(ballSize[1]);
      //   pos.copy(ballPosition2).add(diff2);
      // }

      //   let diff3 = new THREE.Vector3();
      //   let ballPosition3 = new THREE.Vector3(0, 0, 0);//(x, z, y)
      //   diff3.subVectors(pos, ballPosition2);
      //   if (diff3.length() < ballSize[1]) {
      //     // collided
      //     diff3.normalize().multiplyScalar(ballSize[1]);
      //     pos.copy(ballPosition3).add(diff3);
      //   }
    }


    // const ballPosition = this.state.ballPosition.clone();
    //
    // // // Ball Constrains
    // ballPosition.z = -Math.sin(Date.now() / 600) * 90; // + 40;
    // ballPosition.x = Math.cos(Date.now() / 400) * 70;
    //
    // if (true) {
    //   for (particles = this.cloth.particles,
    //          i = 0,
    //          il = particles.length; i < il; i++) {
    //     particle = particles[i];
    //     const pos = particle.position;
    //     diff.subVectors(pos, ballPosition);
    //     if (diff.length() < ballSize) {
    //       // collided
    //       diff.normalize().multiplyScalar(ballSize);
    //       pos.copy(ballPosition).add(diff);
    //     }
    //   }
    // }

    // Floor Constraints
    for (particles = this.cloth.particles, i = 0, il = particles.length
      ; i < il; i++) {
      particle = particles[i];
      const pos = particle.position;
      if (pos.y < -250) {
        pos.y = -250;
      }
    }

    // Pin Constrains
    for (i = 0, il = this.pins.length; i < il; i++) {
      const xy = this.pins[i];
      const p = particles[xy];
      p.position.copy(p.original);
      p.previous.copy(p.original);
    }

    // this.setState({
    //   ballPosition,
    // });
  }

  _onAnimate = () => {
    // this.controls.update();

    const {
      minTimePerFrame,
    } = this.state;

    let time;

    if (minTimePerFrame > 0) {
      time = Math.round(Date.now() / minTimePerFrame) * minTimePerFrame;
    } else {
      time = Date.now();
    }

    if (time === this.state.time) {
      return;
    }

    const windStrength = Math.cos(time / 7000) * 20 + 40;
    this.windForce.set(
      Math.sin(time / 2000),
      Math.cos(time / 3000),
      Math.sin(time / 1000)).normalize().multiplyScalar(windStrength);

    this._simulate(time);

    // console.log(this._clothGeometry);

    const clothGeometry = React3.findTHREEObject(this._clothGeometry);

    // render

    const timer = time * 0.0002;

    const p = this.cloth.particles;

    let il;
    let i;
    for (i = 0, il = p.length; i < il; ++i) {
      clothGeometry.vertices[i].copy(p[i].position);
    }

    clothGeometry.computeFaceNormals();
    clothGeometry.computeVertexNormals();

    clothGeometry.normalsNeedUpdate = true;
    clothGeometry.verticesNeedUpdate = true;

    const newState = {
      time,
      //spherePosition: this.ballPosition,
    };

    if (this.state.rotate) {
      newState.cameraPosition = new THREE.Vector3(
        Math.cos(timer) * 1500,
        this.state.cameraPosition.y,
        Math.sin(timer) * 1500);
    }

    this.setState(newState);
    // this.stats.update();
  };

  _clothRef = (ref) => {
    this._clothGeometry = ref;
  };

  render(){
    const width = window.innerWidth,
      height = window.innerHeight;

    return(
      <div>
        <Scene3D
          clearColor={this.fog.color}
          onAnimate={this._onAnimate}
          forceManualRender={false}
          cameraPosition={this.state.cameraPosition}
          cameraQuaternion={this.state.cameraQuaternion}
          fog={this.fog}
          rotate={this.state.rotate}
          scenePosition={this.scenePosition}
        >
          <World
            position={new THREE.Vector3(0, 0, -34)}
            worldRotation={this.state.worldRotation}
          >
          </World>

          <Model
            key={THREE.Math.generateUUID()}
            position={new THREE.Vector3(0, 0, 0)}
            rotation={new THREE.Euler(-Math.PI/2, 0, 0)}
            parsedModel={this.state.parsedModel}
            mergeGeometries={this.state.mergeGeometries}
          />
          <StaticWorld
            clothRef={this._clothRef}
            cloth={this.cloth}
          />


        </Scene3D>
        <Stats />
      </div>
    );
  }
}

//App.propTypes = {};

export default App;

/*
 <Model
 key={THREE.Math.generateUUID()}
 position={new THREE.Vector3(0, -34, 0)}
 rotation={new THREE.Euler(-Math.PI/2, 0, 0)}
 parsedModel={this.state.parsedModel}
 mergeGeometries={this.state.mergeGeometries}
 />
 <Waist
 parsedModel={this.state.parsedModel}
 ratio={0.3}
 />
 <StaticWorld
 clothRef={this._clothRef}
 cloth={this.cloth}
 />
 */
