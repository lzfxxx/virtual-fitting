import THREE from 'three';
import React from 'react';
import ParsedModel from '../../../lib/parsed_model';
import createMaterial from '../../../lib/create_material';
import obj from '../../../robotSrc.json';

class Model3D extends React.Component {

  static displayName = 'Model3D';

  constructor(props) {
    super(props);
  }


  render() {

  //   let loader = new THREE.JSONLoader();
  //   var newGeometry=null;
  //   var newMaterial=null;
  //   loader.parse(obj, (geometry, materials) => {
  //
  //     console.log('Loaded Mech robot', geometry, materials);
  //
  //     newGeometry = geometry;
  //     newMaterial = new THREE.MeshFaceMaterial( materials );
  //
  //   });
  //   let modelEuler = new THREE.Euler(0, this.state.modelRotation),
  //     modelQuaternion = new THREE.Quaternion().setFromEuler(modelEuler);
  //   return <mesh
  //     geometry={newGeometry}
  //     material={newMaterial}
  //     position={new THREE.Vector3(this.props.position.x, this.props.position.y, this.props.position.z)}
  // quaternion={modelQuaternion}
  // visible={true}
  // scale={1}
  //   />;

    if(typeof this.props.parsedModel.model === 'undefined'){
      let size = 50;
      return (
        <mesh
          key={THREE.Math.generateUUID()}
          position={new THREE.Vector3(this.props.position.x, this.props.position.y, this.props.position.z)}
        >
          <boxGeometry
            width={size}
            height={size}
            depth={size}
          />
          <meshBasicMaterial
            color={0xcc0000}
          />
        </mesh>
      );
    }

    // render model with merged geometries is not supported because MultiMaterials are not yet supported in react-three-renderer
    // if(this.props.mergeGeometries === true){
    // }


    // render model with separate geometries
    let meshes = [];
    let geometries = this.props.parsedModel.geometries;
    let materialsArray = this.props.parsedModel.materialsArray;
    let materialIndices = this.props.parsedModel.materialIndices;
    // console.log('geometries');
    // console.log(geometries);

    // const uuid = "5405FFA6-5372-3096-BA9C-F7443661FF59";
    // // const uuid = "03A99801-89ED-3205-9CCE-582517865AEC";
    // let geometry = geometries.get(uuid);
    // // console.log(geometry.faces);
    // let material = materialsArray[materialIndices.get(uuid)];
    // material = createMaterial(material);
    // meshes = (<mesh
    //   key={uuid}
    // >
    //   <geometry
    //     vertices={geometry.vertices}
    //     faces={geometry.faces}
    //   />
    //   {material}
    // </mesh>);

    geometries.forEach((geometry, uuid) => {
      // console.log('geometry');
      // console.log(geometry);

      // get the right material for this geometry using the material index
      let material = materialsArray[materialIndices.get(uuid)];
      // console.log('material');
      // console.log(material);
      // create a react-three-renderer material component
      material = createMaterial(material);

      meshes.push(
        <mesh
          key={uuid}
        >
          <geometry
            vertices={geometry.vertices}
            faces={geometry.faces}
          />
          {material}
        </mesh>
      );
    });

    return(
      <group
        position={new THREE.Vector3(this.props.position.x, this.props.position.y, this.props.position.z)}
        rotation={new THREE.Euler(this.props.rotation.x, this.props.rotation.y, this.props.rotation.z)}
        scale={new THREE.Vector3(1, 1, 1)}
      >
        {meshes}

      </group>
    );
  }
}


// Model3D.propTypes = {
//   parsedModel: React.PropTypes.instanceOf(ParsedModel),
//   mergeGeometries: React.PropTypes.bool,
//   position: React.PropTypes.instanceOf(THREE.Vector3),
//   quaternion: React.PropTypes.instanceOf(THREE.Quaternion),
//   scale: React.PropTypes.number
// };

export default Model3D;
