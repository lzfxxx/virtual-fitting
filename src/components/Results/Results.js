require('babel-polyfill');

// import App from '../react-three-renderer/js/components/app.react';
import React from 'react';
import ReactDOM from 'react-dom';

//import App from '../react-three/app';
// import THREE from 'three';
// window.onload = function(){
//
//   ReactDOM.render(
//     <App />,
//     document.getElementById('app')
//   );
// };

import JsonObj from './standard-male-figure.json';
import clothJson from './shirt.json';

class ResultPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    // Detects webgl
    if ( ! Detector.webgl ) {
      Detector.addGetWebGLMessage();
      document.getElementById( 'container' ).innerHTML = "";
    }

    // - Global variables -

    // Graphics variables
    var container, stats;
    var camera, controls, scene, renderer;
    var textureLoader;
    var clock = new THREE.Clock();

    // Physics variables
    var gravityConstant = -9.8;
    var collisionConfiguration;
    var dispatcher;
    var broadphase;
    var solver;
    var physicsWorld;
    var rigidBodies = [];
    var margin = 0.05;
    var hinge;
    var cloth;
    var transformAux1 = new Ammo.btTransform();

    // var clothPositions;

    var time = 0;
    var armMovement = 0;

    // - Main code -

    init();
    animate();


    // - Functions -

    function init() {

      initGraphics();

      initPhysics();

      createObjects();

      initInput();

    }

    function initGraphics() {

      container = document.getElementById( 'container' );

      camera = new THREE.PerspectiveCamera( 60, (window.innerWidth - 300) / (window.innerHeight - 150), 0.2, 2000 );

      scene = new THREE.Scene();

      camera.position.x = -12;
      camera.position.y = 7;
      camera.position.z =  4;

      controls = new THREE.OrbitControls( camera );
      controls.target.y = 2;

      renderer = new THREE.WebGLRenderer();
      renderer.setClearColor( 0xbfd1e5 );
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( window.innerWidth - 300, window.innerHeight - 150);
      renderer.shadowMap.enabled = true;

      textureLoader = new THREE.TextureLoader();
      textureLoader.crossOrigin = '';

      var ambientLight = new THREE.AmbientLight( 0x404040 );
      scene.add( ambientLight );

      var light = new THREE.DirectionalLight( 0xffffff, 1 );
      light.position.set( -7, 10, 15 );
      light.castShadow = true;
      var d = 10;
      light.shadow.camera.left = -d;
      light.shadow.camera.right = d;
      light.shadow.camera.top = d;
      light.shadow.camera.bottom = -d;

      light.shadow.camera.near = 2;
      light.shadow.camera.far = 50;

      light.shadow.mapSize.width = 1024;
      light.shadow.mapSize.height = 1024;

      // light.shadowDarkness = 0.65;
      light.shadow.bias = -0.001;
      scene.add( light );

      var light2 = new THREE.DirectionalLight( 0xffffff, 0.3 );
      light2.position.set( 7, 10, -15 );
      light2.castShadow = false;
      d = 10;
      light2.shadow.camera.left = -d;
      light2.shadow.camera.right = d;
      light2.shadow.camera.top = d;
      light2.shadow.camera.bottom = -d;

      light2.shadow.camera.near = 2;
      light2.shadow.camera.far = 50;

      light2.shadow.mapSize.width = 1024;
      light2.shadow.mapSize.height = 1024;

      // light.shadowDarkness = 0.65;
      light2.shadow.bias = -0.001;
      scene.add( light2 );


      container.innerHTML = "";

      container.appendChild( renderer.domElement );

      stats = new Stats();
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.top = '0px';
      container.appendChild( stats.domElement );

      //

      window.addEventListener( 'resize', onWindowResize, false );

    }

    function initPhysics() {

      // Physics configuration

      collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
      dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
      broadphase = new Ammo.btDbvtBroadphase();
      solver = new Ammo.btSequentialImpulseConstraintSolver();
      let softBodySolver = new Ammo.btDefaultSoftBodySolver();
      physicsWorld = new Ammo.btSoftRigidDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration, softBodySolver);
      physicsWorld.setGravity( new Ammo.btVector3( 0, gravityConstant, 0 ) );
      physicsWorld.getWorldInfo().set_m_gravity( new Ammo.btVector3( 0, gravityConstant, 0 ) );

    }

    function createObjects() {

      var p = new THREE.Vector3();
      var q = new THREE.Quaternion();

      p.set( 0, 0, 0 );
      q.set( 0, 0, 0, 1 );
      // createHumanBody(0, p, q);
      createCloth(0, p, q);

      var pos = new THREE.Vector3();
      var quat = new THREE.Quaternion();

      // Ground
      pos.set( 0, - 0.5, 0 );
      quat.set( 0, 0, 0, 1 );
      var ground = createParalellepiped( 40, 1, 40, 0, pos, quat, new THREE.MeshPhongMaterial( { color: 0xFFFFFF } ) );
      ground.castShadow = true;
      ground.receiveShadow = true;

      textureLoader.load( "http://127.0.0.1:8000/ammo.js/examples/textures/grid.png", function( texture ) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 40, 40 );
        ground.material.map = texture;
        ground.material.needsUpdate = true;
      } );

      // // Wall
      // var brickMass = 0.5;
      // var brickLength = 1.2;
      // var brickDepth = 0.6;
      // var brickHeight = brickLength * 0.5;
      // var numBricksLength = 6;
      // var numBricksHeight = 8;
      // var z0 = - numBricksLength * brickLength * 0.5;
      // pos.set( 0, brickHeight * 0.5, z0 );
      // quat.set( 0, 0, 0, 1 );
      // for ( var j = 0; j < numBricksHeight; j ++ ) {
      //
      //   var oddRow = ( j % 2 ) == 1;
      //
      //   pos.z = z0;
      //
      //   if ( oddRow ) {
      //     pos.z -= 0.25 * brickLength;
      //   }
      //
      //   var nRow = oddRow? numBricksLength + 1 : numBricksLength;
      //   for ( var i = 0; i < nRow; i ++ ) {
      //
      //     var brickLengthCurrent = brickLength;
      //     var brickMassCurrent = brickMass;
      //     if ( oddRow && ( i == 0 || i == nRow - 1 ) ) {
      //       brickLengthCurrent *= 0.5;
      //       brickMassCurrent *= 0.5;
      //     }
      //
      //     var brick = createParalellepiped( brickDepth, brickHeight, brickLengthCurrent, brickMassCurrent, pos, quat, createMaterial() );
      //     brick.castShadow = true;
      //     brick.receiveShadow = true;
      //
      //     if ( oddRow && ( i == 0 || i == nRow - 2 ) ) {
      //       pos.z += 0.75 * brickLength;
      //     }
      //     else {
      //       pos.z += brickLength;
      //     }
      //
      //   }
      //   pos.y += brickHeight;
      // }

      // // The cloth
      // // Cloth graphic object
      // var clothWidth = 4;
      // var clothHeight = 3;
      // var clothNumSegmentsZ = clothWidth * 5;
      // var clothNumSegmentsY = clothHeight * 5;
      // var clothSegmentLengthZ = clothWidth / clothNumSegmentsZ;
      // var clothSegmentLengthY = clothHeight / clothNumSegmentsY;
      // var clothPos = new THREE.Vector3( -3, 3, 2 );
      // // var cloth2Pos = new THREE.Vector3( -2.9, 3, 2 );
      //
      // //var clothGeometry = new THREE.BufferGeometry();
      // var clothGeometry = new THREE.PlaneBufferGeometry( clothWidth, clothHeight, clothNumSegmentsZ, clothNumSegmentsY );
      // clothGeometry.rotateY( Math.PI * 0.5 );
      // clothGeometry.translate( clothPos.x, clothPos.y + clothHeight * 0.5, clothPos.z - clothWidth * 0.5 )
      // //var clothMaterial = new THREE.MeshLambertMaterial( { color: 0x0030A0, side: THREE.DoubleSide } );
      // var clothMaterial = new THREE.MeshLambertMaterial( { color: 0xFFFFFF, side: THREE.DoubleSide } );
      // cloth = new THREE.Mesh( clothGeometry, clothMaterial );
      // cloth.castShadow = true;
      // cloth.receiveShadow = true;
      // scene.add( cloth );
      // textureLoader.load( "http://127.0.0.1:8000/ammo.js/examples/textures/grid.png", function( texture ) {
      //   texture.wrapS = THREE.RepeatWrapping;
      //   texture.wrapT = THREE.RepeatWrapping;
      //   texture.repeat.set( clothNumSegmentsZ, clothNumSegmentsY );
      //   cloth.material.map = texture;
      //   cloth.material.needsUpdate = true;
      // } );
      //
      // // Cloth physic object
      // var softBodyHelpers = new Ammo.btSoftBodyHelpers();
      // var clothCorner00 = new Ammo.btVector3( clothPos.x, clothPos.y + clothHeight, clothPos.z );
      // var clothCorner01 = new Ammo.btVector3( clothPos.x, clothPos.y + clothHeight, clothPos.z - clothWidth );
      // var clothCorner10 = new Ammo.btVector3( clothPos.x, clothPos.y, clothPos.z );
      // var clothCorner11 = new Ammo.btVector3( clothPos.x, clothPos.y, clothPos.z - clothWidth );
      // var clothSoftBody = softBodyHelpers.CreatePatch( physicsWorld.getWorldInfo(), clothCorner00, clothCorner01, clothCorner10, clothCorner11, clothNumSegmentsZ + 1, clothNumSegmentsY + 1, 0, true );
      // var sbConfig = clothSoftBody.get_m_cfg();
      // sbConfig.set_viterations( 10 );
      // sbConfig.set_piterations( 10 );
      //
      // clothSoftBody.setTotalMass( 0.9, false );
      // Ammo.castObject( clothSoftBody, Ammo.btCollisionObject ).getCollisionShape().setMargin( margin * 3 );
      // physicsWorld.addSoftBody( clothSoftBody, 1, -1 );
      // cloth.userData.physicsBody = clothSoftBody;
      // // Disable deactivation
      // clothSoftBody.setActivationState( 4 );


      // // The base
      // var armMass = 2;
      // var armLength = 3 + clothWidth;
      // var pylonHeight = clothPos.y + clothHeight;
      // var baseMaterial = new THREE.MeshPhongMaterial( { color: 0x606060 } );
      // pos.set( clothPos.x, 0.1, clothPos.z - armLength );
      // quat.set( 0, 0, 0, 1 );
      // var base = createParalellepiped( 1, 0.2, 1, 0, pos, quat, baseMaterial );
      // base.castShadow = true;
      // base.receiveShadow = true;
      // pos.set( clothPos.x, 0.5 * pylonHeight, clothPos.z - armLength );
      // var pylon = createParalellepiped( 0.4, pylonHeight, 0.4, 0, pos, quat, baseMaterial );
      // pylon.castShadow = true;
      // pylon.receiveShadow = true;
      // pos.set( clothPos.x, pylonHeight + 0.2, clothPos.z - 0.5 * armLength );
      // var arm = createParalellepiped( 0.4, 0.4, armLength + 0.4, armMass, pos, quat, baseMaterial );
      // arm.castShadow = true;
      // arm.receiveShadow = true;
      //
      // // Glue the cloth to the arm
      // var influence = 0.5;
      // clothSoftBody.appendAnchor( 0, arm.userData.physicsBody, false, influence );
      // clothSoftBody.appendAnchor( clothNumSegmentsZ, arm.userData.physicsBody, false, influence );
      //
      // //clothSoftBody2.appendAnchor( 0, arm.userData.physicsBody, false, influence );
      // //clothSoftBody2.appendAnchor( clothNumSegmentsZ, arm.userData.physicsBody, false, influence );
      //
      // // Hinge constraint to move the arm
      // var pivotA = new Ammo.btVector3( 0, pylonHeight * 0.5, 0 );
      // var pivotB = new Ammo.btVector3( 0, -0.2, - armLength * 0.5 );
      // var axis = new Ammo.btVector3( 0, 1, 0 );
      // hinge = new Ammo.btHingeConstraint( pylon.userData.physicsBody, arm.userData.physicsBody, pivotA, pivotB, axis, axis, true );
      // physicsWorld.addConstraint( hinge, true );

    }

    function createHumanBody(mass, pos, quat) {
      // The body
      // instantiate a loader
      var loader = new THREE.OBJLoader();

      var threeObject;
// load a resource
      loader.load(
        // resource URL
        'http://127.0.0.1:8000/models/md_basic_body/md_basic_body.obj',
        // Function when resource is loaded
        function ( object ) {
          // console.log(object);
          // scene.add( object );
          threeObject = object.children[0];
          console.log(threeObject);
          // var threeObject = object.children[0];
          const scale = 0.003;
          threeObject.scale.set(scale, scale, scale);
          threeObject.castShadow = true;
          threeObject.receiveShadow = true;
          scene.add( threeObject );
          threeObject.material.materials.forEach(e => {
            e.color.set(0xffe0bd);
          });
          // var bodyOnly = threeObject.clone();
          // bodyOnly.position.set(-5, 0, 0);
          // scene.add( bodyOnly );

          //Body physic object
          //var threeObject = new THREE.Mesh( new THREE.BoxGeometry( sx, sy, sz, 1, 1, 1 ), material );
          var shape = new Ammo.btConvexHullShape();
          // var shape = new Ammo.btBoxShape( new Ammo.btVector3( sx * 0.5, sy * 0.5, sz * 0.5 ) );
          var vec = new Ammo.btVector3();

          // console.log(threeObject.geometry.getAttribute('position').array);
          var vertex =[];
          var vertices = {};
          threeObject.geometry.getAttribute('position').array.forEach((e, index) => {
            if(index%3 === 0) {
              vertex = [];
              vertex.push(e);
            } else if(index%3 === 1) {
              vertex.push(e);
            } else if(index%3 === 2) {
              vertex.push(e);
              if(!vertices[vertex]) {
                vertices[vertex] = vertex;
                var x = vertex[0], y = vertex[1], z = vertex[2];
                // vec.setValue(v.y*scale, v.z*scale, v.x*scale);
                vec.setValue(x*scale, y*scale, z*scale*0.8);
                shape.addPoint(vec);
              }
            }
          });
          // console.log(vertices);
          shape.setMargin( margin );
          createRigidBody( threeObject, shape, mass, pos, quat);


          // threeObject.rotation.set(-Math.PI * 0.5, 0, -Math.PI * 0.5);
          return threeObject;
        }
      );
    }

    function createCloth(mass, pos, quat) {
      // var loader = new THREE.ObjectLoader();
      //
      // var object = loader.parse(clothJson);
      // cloth = object.children[0];
      // const scale = 0.004;
      // cloth.scale.set(scale, scale, scale);
      // cloth.castShadow = true;
      // cloth.receiveShadow = true;
      //
      // cloth.position.copy( new THREE.Vector3(0,0,0) );
      // cloth.quaternion.copy( new THREE.Quaternion(0,0,0,1) );
      // cloth.rotation.set(0, 0, -Math.PI);
      // scene.add( cloth );
      // return cloth;

      // The cloth
      // Cloth graphic object
      // instantiate a loader
      var loader = new THREE.OBJLoader();

      var threeObject;
// load a resource
      loader.load(
        // resource URL
        'http://127.0.0.1:8000/models/md_fat_cloth2/md_fat_cloth2_d.obj',
        // Function when resource is loaded
        function ( object ) {
          // console.log(object);
          // scene.add( object );
          cloth = object.children[0];
          console.log(cloth);
          // var threeObject = object.children[0];
          const scale = 0.003;
          cloth.scale.set(scale, scale, scale);
          cloth.castShadow = true;
          cloth.receiveShadow = true;
          scene.add( cloth );

          // var clothOnly = cloth.clone();
          // clothOnly.position.set(5, 0, 0);
          // scene.add( clothOnly );


          // Cloth physic object
          //var threeObject = new THREE.Mesh( new THREE.BoxGeometry( sx, sy, sz, 1, 1, 1 ), material );
          // var shape = new Ammo.btConvexHullShape();
          // var shape = new Ammo.btBoxShape( new Ammo.btVector3( sx * 0.5, sy * 0.5, sz * 0.5 ) );
          var vec = new Ammo.btVector3();
          // var s = new Ammo.btScalar();
          // console.log(threeObject.geometry.getAttribute('position').array);
          var vertex =[];
          var vertices = {};
          var vs = [];
          var ss = [];
          var clothPositions = cloth.geometry.getAttribute('position').array;
          var i, j, n, p, n2;
          var g = cloth.geometry;
          var tmpGeo = new THREE.Geometry().fromBufferGeometry( g );
          console.log(tmpGeo);
          tmpGeo.mergeVertices();

          var totalVertices = g.attributes.position.array.length/3;
          var numVertices = tmpGeo.vertices.length;
          var numFaces = tmpGeo.faces.length;

          g.realVertices = new Float32Array( numVertices * 3 );
          g.realIndices = new ( numFaces * 3 > 65535 ? Uint32Array : Uint16Array )( numFaces * 3 );

          i = numVertices;
          while(i--){
            p = tmpGeo.vertices[ i ];
            n = i * 3;
            g.realVertices[ n ] = p.x;
            g.realVertices[ n + 1 ] = p.y;
            g.realVertices[ n + 2 ] = p.z;
          }

          // if(verticesOnly){
          //   tmpGeo.dispose();
          //   return g.realVertices;
          // }

          i = numFaces;
          while(i--){
            p = tmpGeo.faces[ i ];
            n = i * 3;
            g.realIndices[ n ] = p.a;
            g.realIndices[ n + 1 ] = p.b;
            g.realIndices[ n + 2 ] = p.c;
          }

          tmpGeo.dispose();

          //g.realIndices = g.getIndex();
          //g.setIndex(g.realIndices);

          // if(facesOnly){
          //   var faces = [];
          //   i = g.realIndices.length;
          //   while(i--){
          //     n = i * 3;
          //     p = g.realIndices[i]*3;
          //     faces[n] = g.realVertices[ p ];
          //     faces[n+1] = g.realVertices[ p+1 ];
          //     faces[n+2] = g.realVertices[ p+2 ];
          //   }
          //   return faces;
          // }

          // // find same point
          // var ar = [];
          // var pos = g.attributes.position.array;
          // i = numVertices;
          // while(i--){
          //   n = i*3;
          //   ar[i] = [];
          //   j = totalVertices;
          //   while(j--){
          //     n2 = j*3;
          //     if( pos[n2] == g.realVertices[n] && pos[n2+1] == g.realVertices[n+1] && pos[n2+2] == g.realVertices[n+2] ) ar[i].push(j);
          //   }
          // }
          //
          // // generate same point index
          // var pPoint = new ( numVertices > 65535 ? Uint32Array : Uint16Array )( numVertices );
          // var lPoint = new ( totalVertices > 65535 ? Uint32Array : Uint16Array )( totalVertices );
          //
          // p = 0;
          // for(i=0; i<numVertices; i++){
          //   n = ar[i].length;
          //   pPoint[i] = p;
          //   j = n;
          //   while(j--){ lPoint[p+j] = ar[i][j]; }
          //   p += n;
          // }

          g.numFaces = numFaces;
          g.numVertices = numVertices;
          g.maxi = totalVertices;
          // g.pPoint = pPoint;
          // g.lPoint = lPoint;


          // var is = [];
          // clothPositions.forEach((e, index) => {
          //   ss.push(e);
          //   if(index%3 === 0) {
          //     vertex = [];
          //     vertex.push(e);
          //     is.push(index/3);
          //   } else if(index%3 === 1) {
          //     vertex.push(e);
          //   } else if(index%3 === 2) {
          //     vertex.push(e);
          //     var x = vertex[0], y = vertex[1], z = vertex[2];
          //     vec.setValue(x*scale, y*scale, z*scale);
          //     vs.push(vec);
          //   }
          // });
          // console.log("vs");
          // // console.log(vs.length);
          // // console.log(vertices);
          //
          var softBodyHelpers = new Ammo.btSoftBodyHelpers();
          // var clothSoftBody = softBodyHelpers.CreateFromConvexHull( physicsWorld.getWorldInfo(), vs, vs.length, true );

          var clothSoftBody = softBodyHelpers.CreateFromTriMesh( physicsWorld.getWorldInfo(), g.realVertices, g.realIndices, g.numFaces, true );

          // // force nodes
          // var i = vs.length, n;
          // while(i--){
          //   n = i*3;
          //   clothSoftBody.get_m_nodes().at( i ).set_m_x( vs[i] );
          //   // clothSoftBody.get_m_nodes().at( i ).set_m_x(new Ammo.btVector3(ss[n], ss[n+1], ss[n+2]));
          // }


          console.log("CreateFromConvexHull");

          var sbConfig = clothSoftBody.get_m_cfg();
          // sbConfig.set_viterations( 10 );
          // sbConfig.set_piterations( 10 );

          clothSoftBody.setTotalMass( 0.9, false );
          Ammo.castObject( clothSoftBody, Ammo.btCollisionObject ).getCollisionShape().setMargin( margin * 3 );
          physicsWorld.addSoftBody( clothSoftBody, 1, -1 );
          cloth.userData.physicsBody = clothSoftBody;
          // Disable deactivation
          clothSoftBody.setActivationState( 4 );
          // shape.setMargin( margin );
          console.log("addSoftBody");

        //   cloth.material.materials.forEach(e => {
        //     e.color.set(0xb0e0e6);
        //   });
        //   // threeObject.rotation.set(-Math.PI * 0.5, 0, -Math.PI * 0.5);
          return cloth;
        }
      );
    }

    function createParalellepiped( sx, sy, sz, mass, pos, quat, material ) {

      var threeObject = new THREE.Mesh( new THREE.BoxGeometry( sx, sy, sz, 1, 1, 1 ), material );
      var shape = new Ammo.btBoxShape( new Ammo.btVector3( sx * 0.5, sy * 0.5, sz * 0.5 ) );
      shape.setMargin( margin );
      createRigidBody( threeObject, shape, mass, pos, quat );

      return threeObject;

    }

    function createRigidBody( threeObject, physicsShape, mass, pos, quat ) {

      threeObject.position.copy( pos );
      threeObject.quaternion.copy( quat );
      // threeObject.rotationAutoUpdate=false;

      var transform = new Ammo.btTransform();
      transform.setIdentity();
      transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
      transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
      var motionState = new Ammo.btDefaultMotionState( transform );

      var localInertia = new Ammo.btVector3( 0, 0, 0 );
      physicsShape.calculateLocalInertia( mass, localInertia );

      var rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, physicsShape, localInertia );
      var body = new Ammo.btRigidBody( rbInfo );

      threeObject.userData.physicsBody = body;

      scene.add( threeObject );

      if ( mass > 0 ) {
        rigidBodies.push( threeObject );

        // Disable deactivation
        body.setActivationState( 4 );
      }

      physicsWorld.addRigidBody( body );

    }

    function createRandomColor() {
      return Math.floor( Math.random() * ( 1 << 24 ) );
    }

    function createMaterial() {
      return new THREE.MeshPhongMaterial( { color: createRandomColor() } );
    }

    function initInput() {

      window.addEventListener( 'keydown', function( event ) {

        switch ( event.keyCode ) {
          // Q
          case 81:
            armMovement = 1;
            break;

          // A
          case 65:
            armMovement = - 1;
            break;
        }

      }, false );

      window.addEventListener( 'keyup', function( event ) {

        armMovement = 0;

      }, false );

    }

    function onWindowResize() {

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function animate() {

      requestAnimationFrame( animate );

      render();
      stats.update();

    }

    function render() {

      var deltaTime = clock.getDelta();

      updatePhysics( deltaTime );

      controls.update( deltaTime );

      renderer.render( scene, camera );

      time += deltaTime;

    }

    function updatePhysics( deltaTime ) {
      console.log("update");

      // Hinge control
      // hinge.enableAngularMotor( true, 0.8 * armMovement, 50 );
      // console.log("before stepworld");
      // Step world
      physicsWorld.stepSimulation( deltaTime, 10 );
      // console.log("after stepworld");

      // Update cloth
      if(cloth) {
        var softBody = cloth.userData.physicsBody;
        var clothPositions = cloth.geometry.attributes.position.array;
        // console.log(cloth.geometry.getAttribute('position').array);
        // console.log(clothPositions);
        var tmpGeo = new THREE.Geometry().fromBufferGeometry( cloth.geometry );
        // console.log(tmpGeo);
        tmpGeo.mergeVertices();
        // var totalVertices = cloth.geometry.attributes.position.array.length/3;
        var numVertices = tmpGeo.vertices.length;


        var numVerts = clothPositions.length / 3;
        // var numVerts = numVertices;
        var nodes = softBody.get_m_nodes();
        var indexFloat = 0;
        for ( var i = 0; i < numVerts; i ++ ) {

          var node = nodes.at( i );
          var nodePos = node.get_m_x();
          clothPositions[ indexFloat++ ] = nodePos.x();
          clothPositions[ indexFloat++ ] = nodePos.y();
          clothPositions[ indexFloat++ ] = nodePos.z();
        }
        // console.log(nx, ny, nx, nx+ny+nz);
        cloth.geometry.computeVertexNormals();
        cloth.geometry.attributes.position.needsUpdate = true;
        cloth.geometry.attributes.normal.needsUpdate = true;
      }


      // Update rigid bodies
      for ( var i = 0, il = rigidBodies.length; i < il; i++ ) {
        var objThree = rigidBodies[ i ];
        var objPhys = objThree.userData.physicsBody;
        var ms = objPhys.getMotionState();
        if ( ms ) {

          ms.getWorldTransform( transformAux1 );
          var p = transformAux1.getOrigin();
          var q = transformAux1.getRotation();
          objThree.position.set( p.x(), p.y(), p.z() );
          objThree.quaternion.set( q.x(), q.y(), q.z(), q.w() );

        }
      }

    }
  }

  render() {
    return (
      <div id="container"><br /><br /><br /><br /><br />Loading...</div>
    );
  }
}

export default ResultPage;
