import {Input} from "./Input";

import {ModelLoader} from "./modelLoader";

import {StateManager} from "./stateManager";
import {MainMenu_State} from "./mainMenu_State";



document.getElementById("wp_loading").innerText += "\n Game Loaded";



function Game() {
    let self = this;

    let now = performance.now();
    let then = performance.now();
    let delta = 0;

    let hardPause = false;
    this.debug = false;

    //needed canvases
    const mainCanvas = document.getElementById('MainCanvas');
    const pauseCanvas = document.getElementById('PauseCanvas');

    //models
    this.allModelsLoaded = false;




    this.stateManager = new StateManager();

    this.init = function() {
        //set sizes
        self.setCanvasSize(Settings.screen.width, Settings.screen.height);

        //hide pause
        pauseCanvas.style.display = "none";

        //model loader
        this.modelLoader = new ModelLoader(self);


        //inputs
        document.addEventListener( 'keydown', function(event){Input.onKeyDown(event)}, false );
        document.addEventListener( 'keyup', function(event){Input.onKeyUp(event)}, false );

        //mouse
        document.addEventListener('mousemove', Event => {
            self.stateManager.mouseMove(Event)
        }, false);

        document.getElementById("MainCanvas").addEventListener('click', Event => {
            self.stateManager.click(Event)
        }, false);




        self.stateManager.changeState(new MainMenu_State(this));

        update();
    };


    function update() {
        if(Input.isDown(Settings.keyMap.pause) && Input._shiftLeft && !hardPause){
            //hard stop of the app
            hardPause = true;
            pauseCanvas.style.display = "block";
            console.log("Paused");
        }

        if(Input.isDown(Settings.keyMap.resume) && Input._shiftLeft && hardPause){
            //resume app
            hardPause = false;
            pauseCanvas.style.display = "none";

            console.log("Resumed");
        }

        if(Input.isDown('KeyD') && Input.isDown('KeyE')){
            debugger
        }


        if(!hardPause){
            now = performance.now();

            delta = now - then;

            self.stateManager.update(delta);

            self.stateManager.render(delta);

            then = now;


        }


        requestAnimationFrame(update);
    }

    /**
     * Returns if the loop is paused
     * @returns {boolean}
     */
    this.isPaused = function () {
        return hardPause;
    };

    /**
     * This is to set the canvas size.
     * @param Width
     * @param Height
     */
    this.setCanvasSize = function (Width, Height) {
        mainCanvas.width = Width;
        mainCanvas.height = Height;

        pauseCanvas.width = Width;
        pauseCanvas.height = Height;
    };


    this.resizeWindow = function () {
        //Todo: what happens when the window is resized
    };












}

export {Game};