function Chunk() {
    this.voxels = new Map();
}

Chunk.prototype.set = function (X, Y, Z, Data) {
    this.voxels.set(X + "," + Y + "," + Z, Data);
};

Chunk.prototype.get = function (X, Y, Z) {
    return this.voxels.get(X + "," + Y + "," + Z);
};

Chunk.prototype.remove = function (X, Y, Z) {
    this.voxels.delete(X + "," + Y + "," + Z);
};



