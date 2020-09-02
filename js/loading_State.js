import {GLTFLoader} from "./threejs/GLTFLoader";
import {Game_State} from "./game_State";

function Loading_State(Game, GameData, Logger) {
    let self = this;


    Logger.log('Loading State');

    let count = 0;
    let txt = "Loading";
    let dots = "";

    let canvas = document.createElement("canvas");
    document.getElementById('wrapper').appendChild(canvas);
    canvas.width = Settings.screen.width;
    canvas.height = Settings.screen.height;

    let ctx = canvas.getContext('2d');

    //loading files
    let total = 0;

    this.init = function(){




    };

    this.update = function (Delta) {
        if(Game.allModelsLoaded){
            txt = "Done";

            Game.stateManager.changeState(new Game_State(Game, GameData, Logger))
        }
    };

    this.render = function (Delta) {
        ctx.fillStyle = "#50b2ff";

        ctx.fillRect(0, 0, Settings.screen.width, Settings.screen.height);

        ctx.fillStyle = "#000000";
        ctx.font = "35px Georgia";

        count += 1;
        if (count > 45){count = 0;}

        dots = "";

        for(let i = 0; i < count; i += 1){
            dots += ".";
        }
        ctx.fillText(txt + dots, 300, 300);
    };

    this.exit = function () {

    };

    this.dispose = function () {
        canvas.parentNode.removeChild(canvas);
    }

}









export {Loading_State}