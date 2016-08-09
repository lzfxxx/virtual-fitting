import React, { Component, PropTypes } from 'react';
import {Mesh} from 'react-three';
import THREE, {JSONLoader, Vector3, Quaternion, MeshFaceMaterial} from 'three';

import JsonObj from './robotSrc.json';

class RobotRobbyComponent extends Component {

  constructor(props) {

    super(props);

    this.displayName = 'Robby Robot';



    let loader = new JSONLoader();
    // console.log(JsonObj);

    var model = loader.parse(JsonObj);
    console.log(model);
    console.log('Loaded Robby robot', model.geometry, model.materials);
    this.geometry = model.geometry;
    this.material = model.materials;
    // loader.load(JsonObj, (geometry, materials) => {
    //   // console.log('Loaded Robby robot');
    //   console.log('Loaded Robby robot', geometry, materials);
    //
    //   this.geometry = geometry;
    //   this.material = new THREE.MeshFaceMaterial( materials );
    //
    // });
    console.log(this.material);
  }

  render() {
    // console.log(this.props.position);
    // console.log(this.props.quaternion);
    // console.log(this.props.visible);
    // console.log(this.props.scale);

    var materials = [];
    this.material.map(e => materials.push(<meshLambertMaterial
      transparent={e.transparent}
      alphaTest={e.alphaTest}
      side={e.side}
      opacity={e.opacity}
      visible={e.visible}
      color={e.color}
      emissive={e.emissive}
      wireframe={e.wireframe}
      wireframeLinewidth={e.wireframeLinewidth}
    />));
    // meshed.push();

    return <mesh
      key={1}
    >
    </mesh>;

    // render model with separate geometries
    // let meshes = [];
    // let geometries = this.geometries;
    // let materialsArray = this.materials;
    // let materialIndices = this.props.parsedModel.materialIndices;
    // geometries.forEach((geometry, uuid) => {
    //   console.log('geometry');
    //   console.log(geometry);
    //   // get the right material for this geometry using the material index
    //   let material = materialsArray[materialIndices.get(uuid)];
    //   // create a react-three-renderer material component
    //   material = createMaterial(material);
    //
    //   meshes.push(
    //     <mesh
    //       key={uuid}
    //     >
    //       <geometry
    //         vertices={geometry.vertices}
    //         faces={geometry.faces}
    //       />
    //       {material}
    //     </mesh>
    //   );
    // });

    return(
      <group>
        {meshes}
      </group>
    );

  }

}

// RobotRobbyComponent.propTypes = {
//   scale: React.PropTypes.number,
//   position: React.PropTypes.instanceOf(Vector3),
//   quaternion: React.PropTypes.instanceOf(Quaternion),
//   visible: React.PropTypes.bool
// };

export default RobotRobbyComponent;

/*

 */
