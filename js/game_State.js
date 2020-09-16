import * as THREE from "./threejs/three.module";
import {Input} from "./Input";
import {ConsoleCommand} from "./ConsoleCommand";
import {Systems} from "./systems/Systems";
import {Vector3} from "./threejs/three.module";
import {HealthComponent, VisualComponent} from "./systems/Components";
import {Entites} from "./systems/Entities";
import {Game} from "./Game";
import {Building} from "./Building";
import {AxesHelper} from "./threejs/three.module";
import {OrthographicCamera} from "./threejs/three.module";
import {Voxels} from "./Voxels";

document.getElementById('wp_loading').innerText += "\n Game State loaded";


function Game_State(Game, GameData, Logger) {
    let self = this;
    const logger = Logger;

    logger.log('Game state');

    //variables

    //3d
    let renderer, camera, scene;

    //mouse
    let rayCaster, mouse, canvasBounds, leftClicked;
    let intersectedObj, oldIntersectedObj;

    //scene
    let light, ambient, newGame, loadGame, settings, mainMenuGroup;

    //console command
    let consoleCommand = new ConsoleCommand(logger);

    //system control
    let systemControl;

    //command system
    let commandSystem = new CommandSystem(Systems, logger);

    //ECS
    //entites
    let entities = new Entites();

    //components
    let visual = VisualComponent();

    let focus = null;

    let building;
    let voxels = Voxels();

    let tempCamX = 50;
    let cameraLoc = 0;

    let frustumSize = 3000;
    let aspect = Settings.screen.width / Settings.screen.height;

    //fps
    let delta = 0;







    this.init = function(){


        //3d
        renderer = new THREE.WebGLRenderer({canvas: document.getElementById("MainCanvas")});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(Settings.screen.width, Settings.screen.height);

        camera = new THREE.PerspectiveCamera(
            Settings.camera.viewAngle,
            Settings.screen.width / Settings.screen.height,
            Settings.camera.near,
            Settings.camera.far
        );

        /*camera = new OrthographicCamera(
            0.5 * frustumSize * aspect / - 2,
            0.5 * frustumSize * aspect / 2,
            frustumSize / 2,
            frustumSize / - 2,
            0.1,
            100000,
        );*/

        //Systems.cameraSystem.setCamera(camera);



        scene = new THREE.Scene(camera);

        visual.setScene(scene);

        //mouse
        rayCaster = new THREE.Raycaster();
        mouse = new THREE.Vector2(-1000, -1000); //this is to make sure its off screen since you can't get the current mouse position
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


        //console command
        consoleCommand.init({
            div: document.getElementById('wrapper'),
            closingCallback: function (Value) {
                //Todo: change input so it can revert to previous object calling it
                Input.addListener(self.onKeyPress);
            },

            commandSystem: commandSystem,
        });


        //newGame = Game.assets['legoGuy'].clone();
        //scene.add(newGame);

        //Systems.cameraSystem.createPosition('newGame', newGame.position.clone());
        //Systems.cameraSystem.setPositionFrom('newGame');




        //let cube = entities.createEntity("cube");

        //let hp = HealthComponent();


        //visual.create(cube, Game.assets['legoGuy'].clone());
        //visual.get(cube).add(newGame);

        //mainMenuGroup.add(visual.get(cube));

        /*visual.get(cube).userData.press = function(val){
            console.log(val)
        };*/

        window.printEntities = function () {
            entities.print();
        };
        window.logger = function () {
            logger.output();
        };

        console.log(visual.get("cube"));


        building = new Building();

        scene.add(new AxesHelper(50));

/*


        let testNumber = 0;

        for(let x = 0; x < 3; x += 1){
            for(let y = 0; y < 5; y += 1){
                for(let z = 0; z < 2; z += 1){

                    if(y === 0 /!*|| y === 1*!/){
                        building.setVoxel(x, y, z, voxels[2])
                    }else if(x === 0 || z === 0){
                        building.setVoxel(x, y, z, voxels[3])
                    }

                }
            }
        }



        console.log(building.countVoxels());

        let testFloor = building.getFloor(0);





        //building.print();
        let floorZero = entities.createEntity("floorZero");

        let testMesh = visual.create(floorZero);

        building.generateFloorMesh(0, visual.get("floorZero"));

        */
        cameraLoc = 200;
        /*
        //camera.position.set(0, 50, 0);
        //camera.position.set(50, 50, 50);
        //camera.position.set(25, 5, 25);

        */
        camera.position.set(cameraLoc, cameraLoc*1.5, cameraLoc);
        camera.lookAt(new Vector3(0, 0, 0));

        /*
        //camera.position.set(500, 800, 500);
        //camera.lookAt(visual.get(floorZero).position.clone())









        console.log(renderer.info.render);*/

    }; //end of init

    function keypress() {

        if(Input.isDown("Backquote")){
            consoleCommand.show(() => {
                focus = this;
            });
            focus = consoleCommand.input;
        }

        if(Input.isDown("KeyW")){
            visual.get("cube").position.x += 1;
        }

        if(Input.isDown("KeyF")){
            console.log(delta)
        }

        Input.clearKeys();
    }

    this.update = function (Delta) {
        delta = Delta;
        //console.log(Delta)
        //Game.stateManager.addState(new Game_State(Game));

        if(focus){
            focus();
        }else{
            keypress()
        }

        tempCamX += .25;

        if(tempCamX > 50){
            tempCamX = 0;
        }
        //visual.get("floorZero").position.set(tempCamX, 0, 0)



        /*visual.get("cube").rotation.x += .005;
        visual.get("cube").rotation.y += .005;
        visual.get("cube").rotation.z += .05;*/

        //visual.get("cube").position.x += 0.01;

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

        //systems
        Systems.cameraSystem.update();


    };

    this.render = function (Delta) {
        renderer.render(scene, camera);

    }

    this.dispose = function(){
        //Todo: Clean up this code
    };

    this.click = function(Event) {
        //console.log(Event.which)
        Event.preventDefault();


        rayCaster.setFromCamera( mouse, camera );


        let intersects = rayCaster.intersectObjects(mainMenuGroup.children, true);

        if ( intersects.length > 0 ) {
            let parent = intersects[0].object.parent;


            //have the click bubble up the chain to see if there are any clicks
            while (parent !== null){
                if(parent.userData.press){
                    parent.userData.press(Event.which);
                }

                parent = parent.parent;
                //console.log('running')


            }
            /*if(intersects[0].object.parent.userData.press){
                intersects[0].object.parent.userData.press();
            }*/

        }
        return false;
    };

    this.mouseMove = function(Event) {
        mouse.x = ( (Event.clientX - canvasBounds.left) / renderer.domElement.clientWidth ) * 2 - 1;
        mouse.y = - ( (Event.clientY - canvasBounds.top) / renderer.domElement.clientHeight ) * 2 + 1;

    };

    function mouseOver() {


        rayCaster.setFromCamera( mouse, camera );

        let intersects = rayCaster.intersectObjects(mainMenuGroup.children, true);

        if ( intersects.length > 0 ) {
            intersectedObj = intersects[0];
        }else{
            intersectedObj = null;
        }
    }

    this.resize = function(Event) {
        console.log('REsized')
    }
    







}

function CommandSystem(Systems, Logger) {
    let systems = Systems || null;
    const logger = Logger;



    this.command = function (Command) {


        switch (Command[0]) {
            case "system":
                return "System here!";

            case "exit":
                return "bye!!!";

                //camera
            case "mcamera":
            case "mc":
                Systems.cameraSystem.setPosition(Command[1], Command[2], Command[3]);
                console.log(Systems.cameraSystem.getCurrentPosition());
                return "camera moved to " + Command[1] + " " + Command[2] + " " + Command[3];

            case "lookat":
                Systems.cameraSystem.lookAt(Command[1]);
                return "looking at " + Command[1];


            default:
                logger.log({
                    location: "CommandSystem",
                    level: "error",
                    message: Command[0] + " is a unknown command!",
                    info: Command,
                });
                return Command[0] + " is a unknown command!";

        }
    }
}

//fps
function FPS() {

}



export {Game_State}