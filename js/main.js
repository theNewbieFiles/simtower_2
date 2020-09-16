import {Input} from "./Input";
import {Game} from "./Game";
import {Building} from "./Building";
import {Voxels} from "./Voxels";

//prevent context menu from appearing
document.addEventListener('contextmenu', Event => {
    Event.preventDefault();
    return false;
});


let _Game = new Game();


document.addEventListener("DOMContentLoaded", function(){


    //start the loop
    //_Game.init();

    //testing
    let test = new Building(Voxels());

    for(let x = 0; x < 10; x += 1){
        for(let y = 0; y < 10; y += 1){
            for(let z = 0; z < 10; z += 1){
                if(y === 0){
                    test.setVoxel(x, y, z, 2);
                }

                if(x === 0){
                    test.setVoxel(x, y, z, 2);
                }

                if(z === 0){
                    test.setVoxel(x, y, z, 2);
                }


            }
        }
    }

    let chunk = test.getChunk(0,0,0);
    console.log(chunk.count());

    chunk.createMesh();


});



