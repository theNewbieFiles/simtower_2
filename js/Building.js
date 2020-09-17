import {Matrix4, MeshBasicMaterial, PlaneBufferGeometry, Mesh, DoubleSide} from "./threejs/three.module";
import {BufferGeometryUtils} from "./threejs/BufferGeometryUtils";

/**
 *
 * @param Blocks
 * @constructor
 *
 * Todo: trying to key map instead of arrays
 */
function Building(Blocks) {
    let blocks = Blocks;

    let chunks = new Map();


    let voxelCount = 0;

    const CHUNKSIZE = 32;

    this.setVoxel = function (X, Y, Z, Voxel) {
        //figure out what chunk you are in
        let x = Math.floor(X / CHUNKSIZE);
        let y = Math.floor(Y / CHUNKSIZE);
        let z = Math.floor(Z / CHUNKSIZE);

        let location = x + "," + y + "," + z;
        let chunk = chunks.get(location);

        if(!chunk){
            //chunk doesn't exits
            //create the chunk

            chunk = new Chunk(x, y, z, this);
            chunk.init();
            chunks.set(location, chunk);
        }

        chunk.setVoxel(
            X % CHUNKSIZE,
            Y % CHUNKSIZE,
            Z % CHUNKSIZE,
            Voxel
        )


    };

    this.getVoxel = function (X, Y, Z) {
        //debugger
        //figure out what chunk you are in
        let x = Math.floor(X / CHUNKSIZE);
        let y = Math.floor(Y / CHUNKSIZE);
        let z = Math.floor(Z / CHUNKSIZE);

        let location = x + "," + y + "," + z;
        let chunk = chunks.get(location);

        if(!chunk){
            return undefined;
        }

        return chunk.getVoxel(
            X % CHUNKSIZE,
            Y % CHUNKSIZE,
            Z % CHUNKSIZE
        )
    };

    this.getChunk = function(X, Y, Z) {
        return chunks.get(X + "," + Y + "," + Z);

    };

    this.removeVoxel = function (X, Y, Z) {

    };


    this.print = function () {
        console.log(chunks)
    };

    this.stats = function () {
        console.log("Chunks: " + chunks.size);
        let count = 0;

        chunks.forEach(Chunk => {
            count += Chunk.voxels.size;
        });

        console.log("Voxels: " + count);
    }
}



function Chunk(X, Y, Z, Building) {
    this.x = X;
    this.y = Y;
    this.z = Z;

    //links;
    this.XP = null; //x positive
    this.XN = null; //x negative

    this.YP = null; //y positive
    this.YN = null; //y negative

    this.ZP = null; //z positive
    this.ZN = null; //z negative


    this.building = Building;

    this.voxels = new Map();

    //createmesh
    this.cm_loc = null;
    this.geometries = null;
    this.locationMatrix = new Matrix4();

    this.topGeometry = new PlaneBufferGeometry(10, 10);
    this.topGeometry.rotateX(-Math.PI /2);
    this.topGeometry.translate(5,10,5);

    this.rightGeometry = new PlaneBufferGeometry(10, 10);
    this.rightGeometry.rotateY(Math.PI /2);
    this.rightGeometry.translate(10, 5, 5);

    this.leftGeometry = new PlaneBufferGeometry(10, 10);
    this.leftGeometry.rotateY(-Math.PI /2);
    this.leftGeometry.translate(0, 5, 5);


    this.forwardGeometry = new PlaneBufferGeometry(10, 10);
    this.forwardGeometry.rotateY(Math.PI);
    this.forwardGeometry.translate(5, 5, 0);

    this.backwardGeometry = new PlaneBufferGeometry(10, 10);
    //this.backwardGeometry.rotateY(Math.PI);
    this.backwardGeometry.translate(5,5,10);



}

Chunk.prototype.count = function(){
    return this.voxels.size
};

Chunk.prototype.init = function(){
    //todo: do I need to do this???
    //create the links

    let xp = this.building.getChunk(this.x + 1, this.y, this.z);

    if(xp){
        this.XP = xp;
        xp.XN = this;
    }

    let xn = this.building.getChunk(this.x - 1, this.y, this.z);

    if(xn){
        this.XN = xn;
        xn.XP = this;
    }


    let yp = this.building.getChunk(this.x, this.y + 1, this.z);

    if(yp){
        this.YP = yp;
        yp.YN = this;
    }

    let yn = this.building.getChunk(this.x, this.y - 1, this.z);

    if(yn){
        this.YN = yn;
        yn.YP = this;
    }

    let zp = this.building.getChunk(this.x, this.y, this.z + 1);

    if(zp){
        this.ZP = zp;
        zp.ZN = this;
    }

    let zn = this.building.getChunk(this.x, this.y, this.z - 1);
    if(zn){
        this.ZN = zn;
        zn.ZP = this;
    }


};

Chunk.prototype.setVoxel = function (X, Y, Z, Voxel) {
    this.voxels.set(X + "," + Y + "," + Z, Voxel);
};

Chunk.prototype.getVoxel = function (X, Y, Z) {
    return this.voxels.get(X + "," + Y + "," + Z);
};

Chunk.prototype.createMesh = function () {


    this.geometries = [];







    this.voxels.forEach((Voxel, Location) => {


        this.cm_loc = this.getCoords(Location);

        this.locationMatrix.makeTranslation(
            this.cm_loc.x * 10,
            this.cm_loc.y * 10,
            this.cm_loc.z * 10
        );




        //check above
        if(!this.voxels.get(this.cm_loc.x + "," + (this.cm_loc.y + 1)  + "," + this.cm_loc.z)){
            //this.geometries.push(this.topGeometry.clone().applyMatrix4(this.locationMatrix));
        }

        //not checking below cause it won't be seen
        //check below
        /*if(!this.voxels.get(loc.x + "," + (loc.y - 1)  + "," + loc.z)){

        }*/

        //check right
        if(!this.voxels.get((this.cm_loc.x + 1) + "," + this.cm_loc.y  + "," + this.cm_loc.z)){

           // this.geometries.push(this.rightGeometry.clone().applyMatrix4(this.locationMatrix));
        }

        //check left
        if(!this.voxels.get((this.cm_loc.x - 1) + "," + this.cm_loc.y  + "," + this.cm_loc.z)){
            //this.geometries.push(this.leftGeometry.clone().applyMatrix4(this.locationMatrix))
        }


        //check forward
        if(!this.voxels.get(this.cm_loc.x + "," + this.cm_loc.y  + "," + (this.cm_loc.z - 1))){
            //this.geometries.push(this.forwardGeometry.clone().applyMatrix4(this.locationMatrix));
        }

        //check backwards
        if(!this.voxels.get(this.cm_loc.x + "," + this.cm_loc.y  + "," + (this.cm_loc.z + 1))){
            //this.geometries.push(this.backwardGeometry.clone().applyMatrix4(this.locationMatrix))
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

//constants
Chunk.prototype.CHUNKS_SIZE = 32;
Chunk.prototype.MAX_CHUNK_SIZE = 32768;


























/*Floor.prototype.generateMesh = function(Object3d){



    let geometry = BufferGeometryUtils.mergeBufferGeometries(geometries, true);
    geometry.computeBoundingSphere();


    Object3d.add(new Mesh(geometry, new MeshBasicMaterial({wireframe: false})))

    //Object3d.add(mesh);




};*/





/*


function Chunk(Parent) {
    this.voxels = new Map();
    this.visible = true;
    this.parent = Parent;
    this.groups = null;

}


/!**
 *
 * @param X {number}
 * @param Y {number}
 * @param Z {number}
 * @param Value
 *!/
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


/!**
 *
 * @param Offset
 * @param Geometries {Array}
 *!/
Chunk.prototype.generateGeometry = function (Offset, Geometries) {
    //group eveything
    this.generGroup();

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
        /!*if(!this.voxels.get(loc.x + "," + (loc.y - 1)  + "," + loc.z)){

        }*!/

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

Chunk.prototype.generGroup = function(){
    this.groups = {}; //reset
    let group;

    this.voxels.forEach((Voxel, Location) => {

        group = this.groups[Voxel.color];

        if(!group){
            group = this.groups[Voxel.color] = [];
        }

        group.push(Location);



    });

    console.log(this.groups)

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
};

Chunk.prototype.print = function () {
    this.voxels.forEach( (voxel, location) => {
        console.log(location, voxel);
    });
};
*/


export {Building};