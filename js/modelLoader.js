import {GLTFLoader} from "./threejs/GLTFLoader";


function ModelLoader(Game, Logger) {
    const logger = Logger;
    const game = Game;
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
                console.log(gltf, Asset)
                    logger.log({
                        location: 'ModelLoader',
                        message: Asset + " is done loading"

                    });

                    Game.assets.push(gltf);

                    total -= 1;

                    if(total === 0){
                        Game.allModelsLoaded = true;
                        //callback();
                    }
                },

                //progress
                xhr => {

                },

                //error
                error => {
                    console.log(error);
                }


            );
        });
    };

    this.add = function (Name, Path) {
        total += 1;

        loader.load(Path,
            //finished loading
            glft => {
                logger.log({
                    location: 'ModelLoader',
                    message: Name + " is done loading"

                });

                game.assets[Name] = glft.scene.children[0]
            }



            , )
    };






}

export {ModelLoader};