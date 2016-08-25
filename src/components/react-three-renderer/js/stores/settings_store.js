import THREE from 'three';
import EventEmitter from 'events';
import ActionTypes from '../constants';
import AppDispatcher from '../app_dispatcher';
import Globals from '../globals';
import ParsedModel from '../../lib/parsed_model';
import {isFSA} from 'flux-standard-action';
// import BBQ from '../../bbq.json';
import Obj from '../../standard-male-figure.json';
// import Obj from '../../shirt.json';

let CHANGE_EVENT = 'change';


class SettingsStore extends EventEmitter {

  constructor () {
    super();

    this.xSegs = 10;
    this.ySegs = 10;
    this.worldRotation = Globals.WORLD_ROTATION;
    this.cameraPosition = new THREE.Vector3(0, -100, 0);
    this.cameraQuaternion = new THREE.Quaternion();
    this.mergeGeometries = false;
    this.parsedModel = new ParsedModel();
    this._objectLoader = new THREE.ObjectLoader();
    // instantiate a loader
    var loader = new THREE.ObjectLoader();
    // loader = new THREE.JSONLoader();

// assuming we loaded a JSON structure from elsewhere
    var object = loader.parse(Obj);

    // console.log(object);

    // add a bit delay so you can see what is happening
    this.parsedModel.parse(object, {scale: 1});
    // setTimeout(() => {
    //   this.parsedModel.load('Obj', {scale: 0.6}).then(
    //     //resolve
    //     () =>{
    //       this.emitChange();
    //     }
    //   );
    // }, 3000);

    // setTimeout(() => {
    //   this.parsedModel.parseJSON(Obj, {scale: 0.6}).then(
    //     //resolve
    //     () =>{
    //       this.emitChange();
    //     }
    //   );
    // }, 3000);

    AppDispatcher.register((action) => {
      this.handle(action);
    });
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  getSettings() {

    let settings = {
      mergeGeometries: this.mergeGeometries,
      parsedModel: this.parsedModel,
      worldRotation: this.worldRotation,
      cameraPosition: this.cameraPosition,
      cameraQuaternion: this.cameraQuaternion
    };
    return settings;
  }

  handle(action) {

    if(isFSA(action) === false){
      console.error('action not FSA compliant');
    }

    switch(action.type) {

      case ActionTypes.UPDATE_CAMERA:
        this.cameraPosition = action.payload.position;
        this.cameraQuaternion = action.payload.quaternion;
        this.emitChange();
        break;

      default:
      // do nothing
    }
  }
}

export default new SettingsStore();
