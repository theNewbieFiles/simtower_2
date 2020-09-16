import {Color} from "./threejs/three.module";

function Voxels() {
    let voxels = [];

    voxels[2] = {
        //dirt
        color: "#6e4e37",
        weight: 10,
        load: 100,
    };

    voxels[3] = {
        //weak concrete
        color: "#6d6d6d",
        weight: 10,
        load: 100,
    };

    return voxels


}










export {Voxels}