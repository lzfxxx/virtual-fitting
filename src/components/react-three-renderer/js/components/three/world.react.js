import THREE from 'three';
import React from 'react';

class World extends React.Component{

  static displayName = 'World';

  constructor(props){
    super(props);
  }

  render() {
    return (
      <group
        key={'world'}
        quaternion={this.props.worldRotation}
      >
        <mesh
          //key={'floor'}
          key={THREE.Math.generateUUID()} // the key has to be unique otherwise it won't render after an update, I think this is weird
          position={this.props.position}
        >
          <circleBufferGeometry
            radius={30}
            segments={15}
          />
          <meshBasicMaterial
            opacity={0.5}
            color={0x333000}
            side={THREE.DoubleSide}
            wireframe={false}
          />
        </mesh>
        {this.props.children}
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
