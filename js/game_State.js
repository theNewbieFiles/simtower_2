import * as THREE from "./threejs/three.module.js";

document.getElementById('wp_loading').innerText += "\n Game State loaded";


function Game_State() {

    //variables

    //3d
    let renderer, camera, scene;

    //mouse
    let rayCaster, mouse, canvasBounds;
    let intersectedObj, oldIntersectedObj;

    //scene
    let light, newGame, loadGame, settings, mainMenuGroup;




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

        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const newGameMat = new THREE.MeshPhongMaterial( {color: 0x00ff00, wireframe: false} );

        //new game button
        newGame = new THREE.Mesh(geometry, newGameMat);
        newGame.position.set(0, 0, -5);
        mainMenuGroup.add(newGame);

        //button press
        newGame.userData.press = function () {

        };



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


    };

    this.dispose = function(){
        //Todo: Clean up this code
    };

    document.getElementById("MainCanvas").addEventListener('mouseup', click);

    function click(event) {
        event.preventDefault();



        mouse.x = ( (event.clientX - canvasBounds.left) / renderer.domElement.clientWidth ) * 2 - 1;
        mouse.y = - ( (event.clientY - canvasBounds.top) / renderer.domElement.clientHeight ) * 2 + 1;


        rayCaster.setFromCamera( mouse, camera );


        let intersects = rayCaster.intersectObjects(mainMenuGroup.children);

        if ( intersects.length > 0 ) {

            if(intersects[0].object.userData.press){
                intersects[0].object.userData.press();
            }

        }
    }

    //get the mouse coords.
    document.getElementById("MainCanvas").addEventListener('mousemove', mouseCoords);


    function mouseCoords(event) {
        mouse.x = ( (event.clientX - canvasBounds.left) / renderer.domElement.clientWidth ) * 2 - 1;
        mouse.y = - ( (event.clientY - canvasBounds.top) / renderer.domElement.clientHeight ) * 2 + 1;

    }

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

export {Game_State}