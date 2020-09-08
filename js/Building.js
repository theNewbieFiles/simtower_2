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
            floors[floor] = new Floor(floor);

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
        //console.log(floors);
        floors.forEach(Floor => {
            console.log(Floor);
            /*Floor.chunks.forEach(Chunk => {
                console.log(Chunk);
            })*/
        })
    };

    this.generateFloorMesh = function (SelectedFloor, Object3d) {

        let floor = floors[SelectedFloor];



        floor.generateMesh(Object3d);
    }; 
    
    this.getFloor = function (Floor) {
        return floors[Floor];
    };

    this.countVoxels = function () {
        let total = 0;

        floors.forEach(Floor => {
            total += Floor.getCount();
        });

        return total;
    }
    
}



function Floor(Number) {
    this.chunks = new Map();
    this.visible = true;
    this.floor = Number;



}

Floor.prototype.set = function (X, Y, Z, Value) {
//Y doesn't need to be check and changed because if it was over 27 it would be on the next floor

    let x = Math.floor(X / 20);
    //let y = Math.floor(Y / 28);
    let z = Math.floor(Z / 20);

    let _x = X - (x * 20);
    //let _y = Y - (y * 28);
    let _z = Z - (z * 20);

    let chunk = this.chunks.get(x + "," + z);

    if(chunk){
        chunk.set(_x, Y, _z, Value);
    }else{

        let tempChunk = new Chunk(this);
        tempChunk.set(_x, Y, _z, Value);

        this.chunks.set(x + "," + z, tempChunk);
    }

};

Floor.prototype.get = function (X, Y, Z) {
    //Todo: fix this y = 28
    let x = X / 20;
    let y = Y / 20;
    let z = Z / 20;

    let _x = X - (x * 20);
    let _y = Y - (y * 20);
    let _z = Z - (z * 20);

    let chunk = this.chunks.get(x + "," + y + "," + z);

    if(chunk){
        return chunk.get(_x, _y, _z);
    }

    return null;


};

Floor.prototype.generateMesh = function(Object3d){
    let loc = null;
    let offset = {};

    let geometries = [];

    this.chunks.forEach((Chunk, Location) => {

        loc = this.getCoords(Location);

        loc.x *= 20;
        loc.y = this.floor * 28;
        loc.z *= 20;

        Chunk.generateGeometry(loc, geometries);



    });


    let geometry = BufferGeometryUtils.mergeBufferGeometries(geometries, true);
    geometry.computeBoundingSphere();


    Object3d.add(new Mesh(geometry, new MeshBasicMaterial({wireframe: true})))

    //Object3d.add(mesh);




};

Floor.prototype.generateVisibleList = function () {
    this.visible = []; //reset the list



    //console.log(this.visible.length)
};

Floor.prototype.getCoords = function (Location) {

    //chunks only need to know their x and y positions
    Location = Location.split(",");

    return {
        x: parseInt(Location[0]),
        z: parseInt(Location[1]),
    };
};

Floor.prototype.getCount = function () {
    let total = 0;

    this.chunks.forEach(Chunk => {
        total +=  Chunk.getCount();
    });

    return total;
};



function Chunk(Parent) {
    this.voxels = new Map();
    this.visible = true;
    this.parent = Parent;

}


/**
 *
 * @param X {number}
 * @param Y {number}
 * @param Z {number}
 * @param Value
 */
Chunk.prototype.set = function (X, Y, Z, Value) {
    if(
        X >= 0 && X <= 19 &&
        Y >= 0 && Y <= 27 &&
        Z >= 0 && Z <= 19

    ){
        this.voxels.set(X + "," + Y + "," + Z, Value);
    }else{
        console.error(X, Y, Z, " Out of bounds")
    }

};

Chunk.prototype.get = function(X, Y, Z){
    return this.voxels.get(X + "," + Y + "," + Z)
};


/**
 *
 * @param Offset
 * @param Geometries {Array}
 */
Chunk.prototype.generateGeometry = function (Offset, Geometries) {

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

    let loc = null;         //the location of the voxel




    //todo: need a different list for each type of voxel
    this.voxels.forEach((Voxel, Location) => {
        //console.log(Voxel, Location, this.getCoords(Location));


        loc = this.getCoords(Location);


        locationMatrix.makeTranslation(
            (Offset.x + loc.x) * 10,
            (Offset.y + loc.y) * 10,
            (Offset.z + loc.z) * 10
        );




        //check above
        if(!this.voxels.get(loc.x + "," + (loc.y + 1)  + "," + loc.z)){
            Geometries.push(topGeometry.clone().applyMatrix4(locationMatrix));
        }

        //not checking below cause it won't be seen
        //check below
        /*if(!this.voxels.get(loc.x + "," + (loc.y - 1)  + "," + loc.z)){

        }*/

        //check right
        if(!this.voxels.get((loc.x + 1) + "," + loc.y  + "," + loc.z)){

            Geometries.push(rightGeometry.clone().applyMatrix4(locationMatrix));
        }

        //check left
        if(!this.voxels.get((loc.x - 1) + "," + loc.y  + "," + loc.z)){
            //geometries.push(leftGeometry.clone().applyMatrix4(locationMatrix))
        }


        //check forward
        if(!this.voxels.get(loc.x + "," + loc.y  + "," + (loc.z - 1))){
            //geometries.push(forwardGeometry.clone().applyMatrix4(locationMatrix));
        }

        //check backwards
        if(!this.voxels.get(loc.x + "," + loc.y  + "," + (loc.z + 1))){
            Geometries.push(backwardGeometry.clone().applyMatrix4(locationMatrix))
        }

    });

};

Chunk.prototype.getCoords = function (Location) {
    Location = Location.split(",");

    return {
        x: parseInt(Location[0]),
        y: parseInt(Location[1]),
        z: parseInt(Location[2]),
    };
};

Chunk.prototype.getCount = function () {
    return this.voxels.size;
}


export {Building};