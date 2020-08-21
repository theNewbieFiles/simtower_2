import {GLTFLoader} from "./threejs/GLTFLoader";


function ModelLoader(Game) {
    let loader = new GLTFLoader();
    let total;

    this.download = function (ListOfModels, callback) {
        if(!Array.isArray(ListOfModels)){
            ListOfModels = [ListOfModels]
        }
        total = ListOfModels.length;


        ListOfModels.forEach(Asset => {
            loader.load(Asset,
                //done loading
                gltf => {
                    console.log("done", gltf);
                    total -= 1;

                    if(total === 0){
                        Game.allModelsLoaded = true;
                    }
                },

                //progress
                xhr => {
                    console.log("loading", xhr);
                },

                //error
                error => {
                    console.log(error);
                }


            );
        });
    }




}

export {ModelLoader};