

let stateManager = new StateManager();

let now = performance.now();
let then = performance.now();
let delta = 0;


//starting state
let loading_State = new Loading_State();

stateManager.addState(loading_State);


function update() {
    now = performance.now();

    delta = now - then;

    stateManager.update(delta);

    stateManager.render(delta);

    then = now;

    //debugger;
    requestAnimationFrame(update);
}

document.addEventListener("DOMContentLoaded", function(){
    //console.log('ready');

    //start the loop
    update();
});



