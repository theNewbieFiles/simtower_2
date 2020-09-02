import {Matrix4, MeshBasicMaterial, PlaneBufferGeometry, Mesh, DoubleSide} from "./threejs/three.module";
import {BufferGeometryUtils} from "./threejs/BufferGeometryUtils";

function Building() {
    //floors are assumed to be 14feet
    let floors = [];
    let voxelCount = 0;

    //basement floors
    let basement = [];

    this.setVoxel = function (X, Y, Z, Voxel) {
        //figure out what floor its on
        let floor = Math.floor(Y / 28);
        let _y = Y - (floor * 28);

        if(!floors[floor]){
            floors[floor] = new Floor();

        }

        floors[floor].set(X, _y, Z, Voxel);

    };

    this.get = function (X, Y, Z) {
        //figure out what floor its on
        let floor = Math.floor(Y / 28);
        let _y = Y - (floor * 28);

        if(!floors[floor]){
            return null;

        }

        return floors[floor].get(X, _y, Z);
    };

    this.removeVoxel = function (X, Y, Z) {

    }


    this.print = function () {
        console.log(floors);
    }

    this.generateFloorMesh = function (SelectedFloor, Object3d) {
        let floor = floors[SelectedFloor];



        floor.generateMesh(Object3d);
    }; 
    
    this.getFloor = function (Floor) {
        return floors[Floor];
    }
    
}



function Floor() {
    this.voxels = new Map();
    this.visible = null;



}

Floor.prototype.set = function (X, Y, Z, Value) {
    //floors are no larger than 14 feet
    //each voxel is 6 inches
    //Y can't be bigger than 28
    //probably dont need this
    /*if(Y > 28){
        console.error("Y greater than 28");
    }
    if(Y < 0){
        console.error("Y is negative");
    }*/
    this.voxels.set(X + "," + Y + "," + Z, Value);
};

Floor.prototype.get = function (X, Y, Z) {
    return this.voxels.get(X + "," + Y + "," + Z);
};

Floor.prototype.generateMesh = function(Object3d){

    let locationMatrix = new Matrix4();

    let topGeometry = new PlaneBufferGeometry(10, 10);
    topGeometry.rotateX(-Math.PI /2);
    topGeometry.translate(5,10,5);

    let rightGeometry = new PlaneBufferGeometry(10, 10);
    rightGeometry.rotateY(Math.PI /2);
    rightGeometry.translate(10, 5, 5);

    let leftGeometry = new PlaneBufferGeometry(10, 10);
    leftGeometry.rotateY(-Math.PI /2);
    leftGeometry.translate(0, 5, 5);


    let forwardGeometry = new PlaneBufferGeometry(10, 10);
    forwardGeometry.rotateY(Math.PI);
    forwardGeometry.translate(5, 5, 0);

    let backwardGeometry = new PlaneBufferGeometry(10, 10);
    //backwardGeometry.rotateY(Math.PI);
    backwardGeometry.translate(5,5,10);


    let geometries  = [];   //to hold all the geometry
    let loc = null;         //the location of the voxel



    //todo: need a different list for each type of voxel
    this.voxels.forEach((Voxel, Location) => {
        //console.log(Voxel, Location, this.getCoords(Location));


        loc = this.getCoords(Location);


        locationMatrix.makeTranslation(
            loc.x * 10,
            loc.y * 10,
            loc.z * 10
        );




        //check above
        if(!this.voxels.get(loc.x + "," + (loc.y + 1)  + "," + loc.z)){
            geometries.push(topGeometry.clone().applyMatrix4(locationMatrix));
        }

        //not checking below cause it won't be seen
        //check below
        /*if(!this.voxels.get(loc.x + "," + (loc.y - 1)  + "," + loc.z)){

        }*/

        //check right
        if(!this.voxels.get((loc.x + 1) + "," + loc.y  + "," + loc.z)){

            geometries.push(rightGeometry.clone().applyMatrix4(locationMatrix));
        }

        //check left
        if(!this.voxels.get((loc.x - 1) + "," + loc.y  + "," + loc.z)){
            geometries.push(leftGeometry.clone().applyMatrix4(locationMatrix))
        }


        //check forward
        if(!this.voxels.get(loc.x + "," + loc.y  + "," + (loc.z - 1))){
            geometries.push(forwardGeometry.clone().applyMatrix4(locationMatrix));
        }

        //check backwards
        if(!this.voxels.get(loc.x + "," + loc.y  + "," + (loc.z + 1))){
            geometries.push(backwardGeometry.clone().applyMatrix4(locationMatrix))
        }

    });


    let geometry = BufferGeometryUtils.mergeBufferGeometries(geometries, true);
    geometry.computeBoundingSphere();


    Object3d.add(new Mesh(geometry, new MeshBasicMaterial({wireframe: false})))

    //Object3d.add(mesh);




};

Floor.prototype.generateVisibleList = function () {
    this.visible = []; //reset the list



    //console.log(this.visible.length)
};

Floor.prototype.getCoords = function (Location) {

    Location = Location.split(",");

    return {
        x: parseInt(Location[0]),
        y: parseInt(Location[1]),
        z: parseInt(Location[2]),
    };
};


export {Building};