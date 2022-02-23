function Point(X, Y, Z) {
    this.x = X || 0;
    this.y = Y || 0;
    this.z = Z || 0;

}



const BottomNorthWest = 0;
const BottomNorthEast = 1;
const BottomSouthWest = 2;
const BottomSouthEast = 3;
const TopNorthWest = 4;
const TopNorthEast = 5;
const TopSouthWest = 6;
const TopSouthEast = 7;

function Node(Tree, Position, Size, Level) {
    this.tree = Tree;
    this.position = Position;
    this.size = Size;

    this.level = Level;
    this.nodes = [];


    this.compressed = false;
    this.compressedData = null;

}

Node.prototype.split = function () {
    if(this.compressed === false){
        let x = this.position.x;
        let y = this.position.y;
        let z = this.position.z;

        let offset = this.size / 2;

        let newLevel = this.level + 1;

        this.nodes[0] = new Node(this.tree, new Point(x, y, z), offset, newLevel);
        this.nodes[1] = new Node(this.tree, new Point(x + offset, y, z), offset, newLevel);
        this.nodes[2] = new Node(this.tree, new Point(x, y, z + offset), offset, newLevel);
        this.nodes[3] = new Node(this.tree, new Point(x + offset, y, z + offset), offset, newLevel);

        this.nodes[4] = new Node(this.tree, new Point(x, y + offset, z), offset, newLevel);
        this.nodes[5] = new Node(this.tree, new Point(x + offset, y + offset, z), offset, newLevel);
        this.nodes[6] = new Node(this.tree, new Point(x, y + offset, z + offset), offset, newLevel);
        this.nodes[7] = new Node(this.tree, new Point(x + offset, y + offset, z + offset), offset, newLevel);
    }else{
        //node is compressed
    }


};


Node.prototype.add = function (Position, Data) {
    if (!this.contains(Position)) {
        return
    }

    if (this.level === this.tree.maxSize) {

        this.nodes = Data;
        return true;
    }

    if (Array.isArray(this.nodes) && !this.nodes.length) {
        this.split();
    }


    let results = null;

    for (let i = 0; i < this.nodes.length; i += 1) {
        results = this.nodes[i].add(Position, Data);

        if (results) {
            return;
        }

    }

    this.nodes.forEach(Child => {

    });


};

Node.prototype.get = function (Position) {


    if (this.contains(Position)) {

        if(!this.compressed){
            if (this.size === 1) {

                return this.nodes;
            }


            let results = null;

            if (Array.isArray(this.nodes)) {
                if(this.nodes.length > 0){
                    for (let i = 0; i < this.nodes.length; i += 1) {
                        results = this.nodes[i].get(Position);

                        if (results !== -1) {
                            return results;
                        }

                    }

                    return -1; //nothing was found return -1;
                }else{
                    //there are no more nodes
                    return -1;
                }

            }
        }else{
            //check if its in compressedData
            //todo: figure out how to check compressed data


            return this.nodes;
        }
    }else{
        return -1
    }


};

Node.prototype.contains = function (Point) {
    return Point.x >= this.position.x  &&
        Point.y >= this.position.y &&
        Point.z >= this.position.z &&
        Point.y < this.position.y + this.size &&
        Point.x < this.position.x + this.size &&
        Point.z < this.position.z + this.size;

};


function OctTree(X, Y, Z, Size, MaxSize) {

    this.maxSize = MaxSize || 6;
    this.root = new Node(this, new Point(X, Y, Z), Size, 1);


}

OctTree.prototype.get = function (X, Y, Z) {
    return this.root.get(new Point(X, Y, Z));
};


OctTree.prototype.add = function (X, Y, Z, Data) {
    this.root.add(new Point(X, Y, Z), Data);
};

/*
* Todo: Optimizations: if only a few voxels are different, only keep track of the different ones.
*
*
*/



export {OctTree, Point}