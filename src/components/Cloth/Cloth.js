require('babel-polyfill');

// import App from '../react-three-renderer/js/components/app.react';
import React from 'react';
import ReactDOM from 'react-dom';

//import App from '../react-three/app';
//import THREE from 'three';
// window.onload = function(){
//
//   ReactDOM.render(
//     <App />,
//     document.getElementById('app')
//   );
// };

import THREE from 'three';

// inject Three.js
import Physijs from 'physijs-webpack';

class ResultPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    //Physijs.scripts.worker = 'http://127.0.0.1:8000/Physijs/physijs_worker.js';
    //Physijs.scripts.ammo = 'http://127.0.0.1:8000/Physijs/examples/js/ammo.js';

    var initScene, render, renderer, scene, camera, box;

    initScene = function() {
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize( window.innerWidth, window.innerHeight );
      document.getElementById( 'container' ).appendChild( renderer.domElement );

      scene = new Physijs.Scene;

      camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        1,
        1000
      );
      camera.position.set( 60, 50, 60 );
      camera.lookAt( scene.position );
      scene.add( camera );

      // Box
      box = new Physijs.BoxMesh(
        new THREE.CubeGeometry( 5, 5, 5 ),
        new THREE.MeshBasicMaterial({ color: 0x888888 })
      );
      scene.add( box );

      requestAnimationFrame( render);
    };

    render = function() {
      scene.simulate(); // run physics
      renderer.render( scene, camera); // render the scene
      requestAnimationFrame( render );
    };

    window.onload = initScene();
  }

  render() {
    return (
      <div id="container"><br /><br /><br /><br /><br />Loading...</div>
    );
  }
}

export default ResultPage;
