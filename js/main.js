import {Input} from "./Input";
import {Game} from "./Game";

document.addEventListener('contextmenu', Event => {
    Event.preventDefault();
    return false;
});







let _Game = new Game();









document.addEventListener("DOMContentLoaded", function(){



    //start the loop
    _Game.init();
});



