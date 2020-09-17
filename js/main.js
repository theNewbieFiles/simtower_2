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

    for(let x = 0; x < 32; x += 1){
        for(let y = 0; y < 32; y += 1){
            for(let z = 0; z < 32; z += 1){
                test.setVoxel(x,y,z,"0")
                /*if(y === 0){
                    test.setVoxel(x, y, z, 2);
                }

                if(x === 0){
                    test.setVoxel(x, y, z, 2);
                }

                if(z === 0){
                    test.setVoxel(x, y, z, 2);
                }*/


            }
        }
    }

    let chunk = test.getChunk(0,0,0);

    test.stats();



    let count = 1;
    let total = 0;
    let start = 0;
    for(let rep = 0; rep < 1; rep += 1, count *= 10){
        for(let cu = 0; cu < count; cu += 1){
            start = performance.now();
            chunk.createMesh();
            total += performance.now() - start


        }

        console.log(total)
        console.log(total / count)
    }



});



