document.getElementById("wp_loading").innerText += "\n Game Loaded";

import {StateManager} from "./stateManager.js";
import {MainMenu_State} from "./mainMenu_State.js";
import {Game_State} from "./game_State.js";

import * as THREE from './threejs/three.module.js';
import * as GLTFLoader from "./threejs/GLTFLoader.js";





function Game() {
    let self = this;
    console.log('Game');

    let now = performance.now();
    let then = performance.now();
    let delta = 0;



    this.stateManager = new StateManager();










    this.init = function() {
        /*let loading = document.getElementById("wp_loading");

        loading.innerText = "Almost Done";*/
        console.log("init");

        this.stateManager.changeState(new MainMenu_State(this));

        update();
    };


    function update() {
        now = performance.now();

        delta = now - then;

        self.stateManager.update(delta);

        self.stateManager.render(delta);

        then = now;

        //debugger;
        requestAnimationFrame(update);
    }


}

export {Game};