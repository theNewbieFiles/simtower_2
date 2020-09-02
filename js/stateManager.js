function StateManager() {
    let states = [];

    this.addState = function (State) {
        states.push(State);

        if(typeof State.init === 'function'){
            State.init();
        }
    };

    this.popState = function () {
        let currentState = states[states.length - 1];

        if(currentState && typeof currentState.dispose === 'function'){
            currentState.dispose();
        }

        states.pop();
    };

    this.changeState = function (State) {
        let currentState = states[states.length - 1];

        if(currentState && typeof currentState.exit === 'function'){
            currentState.exit();
        }

        if(currentState && typeof currentState.dispose === 'function'){
            currentState.dispose();
        }

        if(typeof State.init === 'function'){
            State.init();
        }

        states.push(State)


    };

    this.keyUp = function (Event) {
        let currentState = states[states.length - 1];

        if(currentState && typeof currentState.keyUp === 'function'){
            currentState.keyUp(Event);
        }
    };

    this.mouseMove = function (Event) {
        let currentState = states[states.length - 1];

        if(currentState && typeof currentState.mouseMove === 'function'){
            currentState.mouseMove(Event);
        }
    };

    this.click = function (Event) {
        let currentState = states[states.length - 1];

        if(currentState && typeof currentState.click === 'function'){
            currentState.click(Event);
        }
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

    this.resize = function (Event) {
        let currentState = states[states.length - 1];

        if(typeof currentState.resize === 'function'){
            currentState.resize(Event);
        }

    };


}

export {StateManager};