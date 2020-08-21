import * as THREE from "./threejs/three.module";
import {Input} from "./Input";
import {ConsoleCommand} from "./ConsoleCommand";

document.getElementById('wp_loading').innerText += "\n Game State loaded";


function Game_State(Game) {
    let self = this;
    //variables

    //3d
    let renderer, camera, scene;

    //mouse
    let rayCaster, mouse, canvasBounds, leftClicked;
    let intersectedObj, oldIntersectedObj;

    //scene
    let light, ambient, newGame, loadGame, settings, mainMenuGroup;

    //console command

    let consoleCommand = new ConsoleCommand();
    let commandSystem = new CommandSystem();




    this.init = function(){
        //hide the welcome page
        document.getElementById("welcome_page").style.display = 'none';

        //3d
        renderer = new THREE.WebGLRenderer({canvas: document.getElementById("MainCanvas")});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(Settings.screen.width, Settings.screen.height);

        camera = new THREE.PerspectiveCamera(
            75,                                             //view angle
            Settings.screen.width / Settings.screen.height, //aspect
            0.1,                                            //near
            50                                              //far
        );

        scene = new THREE.Scene(camera);

        //mouse
        rayCaster = new THREE.Raycaster();
        mouse = new THREE.Vector2(-1000, -1000);
        canvasBounds = document.getElementById('MainCanvas').getBoundingClientRect();

        //setup the scene
        //group
        mainMenuGroup = new THREE.Group();
        scene.add(mainMenuGroup);

        //light
        light = new THREE.DirectionalLight(0xFFFFFF, .75);
        light.position.set(0, 0, 100);
        light.target.position.set(0, 0, 0);
        mainMenuGroup.add(light);

        ambient = new THREE.AmbientLight(0xFFFFFF, .5);
        mainMenuGroup.add(ambient);

        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const newGameMat = new THREE.MeshPhongMaterial( {color: 0x00ff00, wireframe: false} );

        //new game button
        newGame = new THREE.Mesh(geometry, newGameMat);
        newGame.position.set(0, 0, -5);
        mainMenuGroup.add(newGame);

        //button press
        newGame.userData.press = function () {
            console.log("pressed")


        };


        //setup keyboard listener
        Input.addListener(this.onKeyPress);

        //console command
        consoleCommand.init({
            div: document.getElementById('wrapper'),
            closingCallback: function (Value) {
                //Todo: change input so it can revert to previous object calling it
                Input.addListener(self.onKeyPress);
            },

            commandSystem: commandSystem,
        });


    };

    this.onKeyPress = function (Value) {

        console.log(Value, Value.keys);

       switch (Value.code) {
           case 'Backquote':
                consoleCommand.show();
               Input.addListener(consoleCommand.input);

       }
    };

    this.update = function () {
        //Game.stateManager.addState(new Game_State(Game));
        renderer.render(scene, camera);


        newGame.rotation.x += .005;
        newGame.rotation.y += .005;

        mouseOver();
        if(intersectedObj){
            if(intersectedObj !== oldIntersectedObj){

                if(oldIntersectedObj){
                    oldIntersectedObj.object.material.color.r = oldIntersectedObj.object.userData.color.r;
                    oldIntersectedObj.object.material.color.g = oldIntersectedObj.object.userData.color.g;
                    oldIntersectedObj.object.material.color.b = oldIntersectedObj.object.userData.color.b;
                }

                intersectedObj.object.userData.color = {};

                intersectedObj.object.userData.color.r = intersectedObj.object.material.color.r;
                intersectedObj.object.userData.color.g = intersectedObj.object.material.color.g;
                intersectedObj.object.userData.color.b = intersectedObj.object.material.color.b;

                intersectedObj.object.material.color.setColorName("blue");

                oldIntersectedObj = intersectedObj;
            }
        }else if(oldIntersectedObj){

            oldIntersectedObj.object.material.color.r = oldIntersectedObj.object.userData.color.r;
            oldIntersectedObj.object.material.color.g = oldIntersectedObj.object.userData.color.g;
            oldIntersectedObj.object.material.color.b = oldIntersectedObj.object.userData.color.b;
        }


        if(leftClicked){

        }


    };

    this.dispose = function(){
        //Todo: Clean up this code
    };

    this.click = function(Event) {
        Event.preventDefault();

        rayCaster.setFromCamera( mouse, camera );


        let intersects = rayCaster.intersectObjects(mainMenuGroup.children);

        if ( intersects.length > 0 ) {

            if(intersects[0].object.userData.press){
                intersects[0].object.userData.press();
            }

        }
    };

    this.mouseMove = function(Event) {
        mouse.x = ( (Event.clientX - canvasBounds.left) / renderer.domElement.clientWidth ) * 2 - 1;
        mouse.y = - ( (Event.clientY - canvasBounds.top) / renderer.domElement.clientHeight ) * 2 + 1;

    };

    function mouseOver() {


        rayCaster.setFromCamera( mouse, camera );

        let intersects = rayCaster.intersectObjects(mainMenuGroup.children);

        if ( intersects.length > 0 ) {
            intersectedObj = intersects[0];
        }else{
            intersectedObj = null;
        }
    }
    







}

function CommandSystem(Systems) {
    let systems = Systems || null;

    this.command = function (Command) {
        switch (Command[0]) {
            case "system":
                return "System here!";

            case "exit":
                return "bye!!!";


            default:
                return Command[0] + " is a unknown command!";

        }
    }
}



export {Game_State}