import {GLTFLoader} from "./threejs/GLTFLoader";

function Loading_State() {

    let updatedNum = 0;
    let done = false;
    let status;

    let welcomePage = document.getElementById('welcome_page');
    welcomePage.style.width = Settings.screen.width + "px";
    welcomePage.style.height = Settings.screen.height + "px";
    let opacity = 1;

    let loadingBar = document.getElementById('wp_loadingBar');

    //title
    let title = document.getElementById('wp_title');
    title.innerText = Settings.title;

    let scriptLoader = new ScriptLoader();

    let List_of_scripts = ["js/Game.js", "js/mainMenu_State", "js/game_State.js", "js/threejs/GLTFLoader.js", "js/threejs/three.js"];

    scriptLoader.download(List_of_scripts, () => {
        loadingBar.innerText = "100%";
        //console.log("Done");

        done = true;

        let loader = new GLTFLoader();

    });

    this.update = function (Delta) {
        if(!done){
            status = scriptLoader.status();
            console.log(status);
            loadingBar.innerText = ((status.totalDone / status.total) * 100) + "%";

        }else{
            //all the files are done loading

            //fade welcome page
            if(opacity <= 0.1){
                //welcome page is faded
                welcomePage.style.display = 'none';


                stateManager.addState(new MainMenu_State(new Game));




            }

            welcomePage.style.opacity = opacity;
            welcomePage.style.filter = 'alpha(opacity=' + opacity * 100 + ")";
            opacity -= opacity * 0.05;




        }
    };

    this.render = function (Delta) {
        //console.log('render');
    };

}









