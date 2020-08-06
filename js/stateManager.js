function StateManager() {
    let states = [];

    this.addState = function (State) {
        states.push(State);
    };

    this.popState = function () {
        states.pop();
    };

    this.changeState = function (State) {
        let currentState = states[states.length - 1];

        if(currentState && typeof currentState.dispose === 'function'){
            currentState.dispose();
        }

        if(typeof State.init === 'function'){
            State.init();
        }

        states.push(State)


    };

    this.update = function (Delta) {
        let currentState = states[states.length - 1];

        if(typeof currentState.update === 'function'){
            currentState.update(Delta);
        }

    };

    this.render = function (Delta) {
        let currentState = states[states.length - 1];

        //pre-render
        if(typeof currentState.preRender === 'function'){
            currentState.preRender(Delta);
        }

        //render
        if(typeof currentState.render === 'function'){
            currentState.render(Delta);
        }

        //post-render
        if(typeof currentState.postRender === 'function'){
            currentState.postRender(Delta);
        }

    };


}

export {StateManager};