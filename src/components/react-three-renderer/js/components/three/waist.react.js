import THREE from 'three';
import React from 'react';

import createMaterial from '../../../lib/create_material';


class World extends React.Component{

  static displayName = 'World';

  constructor(props){
    super(props);
  }

  render(){
    let materialsArray = this.props.parsedModel.materialsArray;
    //let materialIndices = this.state.parsedModel.materialIndices;

    // get the right material for this geometry using the material index
    let material = materialsArray[0];
    // create a react-three-renderer material component
    material = createMaterial(material);

    let ratio = this.props.ratio;
    return(
      <group
        key={'waist'}
      >
        <mesh
          //yao
          //key={'floor'}
          key={THREE.Math.generateUUID()} // the key has to be unique otherwise it won't render after an update, I think this is weird
          position={new THREE.Vector3(0, 0, -1)}
          scale={new THREE.Vector3(1.2*ratio, 0.8*ratio, 0.8*ratio)}
        >
          <sphereGeometry
            radius={5}
          />
          {material}
        </mesh>
        <mesh
          //duzi
          //key={'floor'}
          key={THREE.Math.generateUUID()} // the key has to be unique otherwise it won't render after an update, I think this is weird
          position={new THREE.Vector3(0, 0, 0.5)}
          scale={new THREE.Vector3(1*ratio, 1.4*ratio, 0.7*ratio)}
        >
          <sphereGeometry
            radius={5}
          />
          {material}
        </mesh>
      </group>
    );
  }
}

// World.propTypes = {
//   position: React.PropTypes.instanceOf(THREE.Vector3),
//   worldRotation: React.PropTypes.instanceOf(THREE.Quaternion)
// };

export default World;

/*
 width={60}
 height={60}
 widthSegments={30}
 heightSegments={30}
 */
