import {Input} from "./Input";
import {Game} from "./Game";
import {Building, Cell} from "./Building";
import {Voxels} from "./Voxels";
import {OctTree, Point} from "./OctTree";

//prevent context menu from appearing
document.addEventListener('contextmenu', Event => {
    Event.preventDefault();
    return false;
});


//let _Game = new Game();


document.addEventListener("DOMContentLoaded", function(){


    //start the loop
    //_Game.init();

    let test = new Cell(0,0,0,0,0,0, null);

    console.time('create');
    for(let x = 0; x < 4; x += 1){
        for(let y = 0; y < 4; y += 1){
            for(let z = 0; z < 4; z += 1){
                test.setVoxel(x, y, z, 0);

            }
        }
    }
    console.timeEnd("create");


    console.log(test)

});



