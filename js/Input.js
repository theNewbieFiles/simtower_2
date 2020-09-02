/**
 * This is a global object for detecting keyboard input.
 *
 * @type {{_pressed: {}, _anyKeyPressed: boolean, _keyList: Array, _ctrl: boolean, isDown: (function(*): *), isKeyDown: (function(): boolean), onKeyDown: Input.onKeyDown, onKeyUp: Input.onKeyUp, clearKeys: Input.clearKeys}}
 */

let Input = {

    _pressed: {},

    _anyKeyPressed: false,

    _keyList: [],

    _ctrl: false,

    _shiftLeft: false,

    _altRight: false,

    _currentListener: null,

    addListener: function(Callback){
        this._currentListener = Callback;
    },

    isDown: function(keyCode){
        return this._pressed[keyCode];
    },

    isKeyDown: function(){
        return this._anyKeyPressed;
    },

    onKeyDown: function(event){
        this._pressed[event.code] = true;// = performance.now();
        this._anyKeyPressed = true;

        if(event.code === "ControlLeft"){
            this._ctrl = true;
        }

        if(event.code === "ShiftLeft"){
            this._shiftLeft = true;
        }

        if(event.code === "AltRight"){
            this._altRight = true;
        }

        this._keyList.push(event.code);
        if(this._keyList.length > 10){
            this._keyList.shift();
        }

        /*if(this._currentListener){
            this._currentListener({
                code: event.code,
                keys: this._pressed,
                ctrl: this._ctrl,
                shiftLeft: this._shiftLeft,
                keyList: this._keyList
            });
        }*/


    },

    onKeyUp: function(event){
        //delete this._pressed[event.code];
        this._pressed[event.code] = false;
        this._anyKeyPressed = false;

        if(event.code === "ControlLeft"){
            this._ctrl = false;
        }

        if(event.code === "ShiftLeft"){
            this._shiftLeft = false;
        }

        if(event.code === "AltRight"){
            this._altRight = false;
        }

        if(this._shiftLeft){
            console.log(event.code);
        }
    },

    clearKeys: function(){
        this._pressed = {};
        this._anyKeyPressed = false;
        this._ctrl = false;
    }




};







export {Input};



