import {CameraSystem} from "./CameraSystem";
import {Entites} from "./Entities";
import {Components} from "./Components";


let Systems = {};
Systems.cameraSystem = new CameraSystem();
Systems.entities = new Entites();
Systems.components = new Components();

export {Systems}