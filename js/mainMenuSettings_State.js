import {Input} from "./Input";

function MainMenuSettings_State(Game) {




    this.init = function () {
        console.log("mainMenu Settings ")

        //Todo: Code this window
    };

    this.update = function (Delta) {

        if(Input.isDown("Enter")){
            Game.stateManager.popState();
        }

    };

    this.render = function (Delta) {

    };

    this.dispose = function() {
        console.log("ok, bye!");
    };







    this.click = function(Event) {};

    this.mouseMove = function(Event) {};
}

export {MainMenuSettings_State};