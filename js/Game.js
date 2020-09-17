import {Input} from "./Input";

import {ModelLoader} from "./modelLoader";

import {StateManager} from "./stateManager";
import {MainMenu_State} from "./mainMenu_State";

import {Logger} from "./Logger";
import Stats from "./threejs/stats.module";






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
    let total = 0;
    this.assets = {};

    let logger = new Logger();

    let stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild( stats.dom );







    this.stateManager = new StateManager();

    this.init = function() {
        document.getElementById("wp_loading").innerText += "\n Game Loaded";
        logger.log('Game.init');
        //set sizes
        self.setCanvasSize(Settings.screen.width, Settings.screen.height);

        //hide pause
        pauseCanvas.style.display = "none";

        //model loader
        this.modelLoader = new ModelLoader(self, logger);


        //inputs
        document.addEventListener( 'keydown', function(Event){Input.onKeyDown(Event)}, false );
        document.addEventListener( 'keyup', function(Event){ Input.onKeyUp(Event)}, false );

        //mouse
        document.addEventListener('mousemove', Event => {
            self.stateManager.mouseMove(Event)
        }, false);

        document.getElementById("MainCanvas").addEventListener('mousedown', Event => {

            self.stateManager.click(Event)
        }, false);




        self.stateManager.changeState(new MainMenu_State(this, logger));

        update();
    };


    function update() {
        if(Input.isDown(Settings.keyMap.pause) && Input._altRight && !hardPause){
            //hard stop of the app
            hardPause = true;
            pauseCanvas.style.display = "block";
            console.log("Paused");
        }

        if(Input.isDown(Settings.keyMap.resume) && Input._altRight && hardPause){
            //resume app
            hardPause = false;
            pauseCanvas.style.display = "none";

            console.log("Resumed");
        }

        if(Input.isDown('KeyD') && Input._altRight){
            debugger
        }


        if(!hardPause){
            stats.begin();
            now = performance.now();

            delta = now - then;

            self.stateManager.update(delta);

            self.stateManager.render(delta);

            then = now;




            stats.end();
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


    window.addEventListener('resize', Event => {
        //Todo: what happens when the window is resized

        this.stateManager.resize(Event);
    });

    this.setTotal = function (Total) {
        total = Total;
    };

    this.checkDownload = function (Passed) {
        if(!Passed){
            //attempt redownload the file...
            //create a red square or something
        }
        total -= 1;

        if(total === 0){
            this.allModelsLoaded = true;
        }
    }












}

export {Game};