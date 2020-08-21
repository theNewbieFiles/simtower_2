import {Game_State} from "./game_State";
import {MainMenuSettings_State} from "./mainMenuSettings_State";

import * as THREE from './threejs/three.module';
import * as GLTFLoader from "./threejs/GLTFLoader";


function MainMenu_State(Game) {
    const self = this;
    //variables

    //3d
    let renderer, camera, scene;

    //mouse
    let rayCaster, mouse, canvasBounds;
    let intersectedObj, oldIntersectedObj;

    //scene
    let light, ambient, newGame, loadGame, settings, mainMenuGroup;


    this.init = function(){
        //hide the welcome page
        document.getElementById("welcome_page").style.display = 'none';

        //start to download models
        Game.modelLoader.download(["./assets/Assets.glb"]);

        //3d
        renderer = new THREE.WebGLRenderer({canvas: document.getElementById("MainCanvas")});
        renderer.setPixelRatio(window.devicePixelRatio);
        //renderer.setSize(Settings.screen.width, Settings.screen.height);

        camera = new THREE.PerspectiveCamera(
            75,                                             //view angle
            renderer.domElement.clientWidth / renderer.domElement.clientHeight, //aspect
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
        const loadGameMat = new THREE.MeshPhongMaterial( {color: 0xffff00, wireframe: false} );
        const settingsMat = new THREE.MeshPhongMaterial( {color: 0x00ffff, wireframe: false} );

        //new game button
        newGame = new THREE.Mesh(geometry, newGameMat);
        newGame.position.set(0, 0, -5);
        mainMenuGroup.add(newGame);

        //button press
        newGame.userData.press = function () {
            //cleanup

            Game.stateManager.changeState(new Game_State(Game));
        };


        //load game button
        loadGame = new THREE.Mesh(geometry, loadGameMat);
        loadGame.position.set(-2, 0, -5);
        mainMenuGroup.add(loadGame)
        loadGame.userData.press = function () {
            //Todo: code loadGame button
            console.log('Load game');
        };

        //settings button
        settings = new THREE.Mesh(geometry, settingsMat);
        settings.position.set(0, 2, -5);
        mainMenuGroup.add(settings);
        settings.userData.press = function () {
            //Todo: code settings button
            Game.stateManager.addState(new MainMenuSettings_State(Game, self))
        }


    };

    this.update = function (Delta) {


        if(Game.allModelsLoaded){
            newGame.rotation.x += .005;
            newGame.rotation.y += .005;


            Game.stateManager.changeState(new Game_State(Game));
        }

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


    };

    this.render = function (Delta) {
        renderer.render(scene, camera);
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
























    //Game.div.main_canvas.removeEventListener('mouseup', click);


}


export {MainMenu_State};