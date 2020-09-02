import {Input} from "./Input";

/**
 *
 * @constructor
 */
function ConsoleCommand(Logger) {
    let self = this;
    const logger = Logger;

    let parent; //parent div to attach to

    let wrapper = document.createElement('div');
    wrapper.id = "consoleWrapper";

    let inputText = document.createElement('input');
    inputText.type = 'text';
    inputText.id = 'cc_input';

    wrapper.appendChild(inputText);

    //output
    let output = document.createElement('textarea');
    wrapper.appendChild(output);


    let closingCallback;

    let commandSystem;

    //list of previous commands
    let listOfCommands = [];
    let commandPosition = 0;


    /**
     *
     * @param Options {div, closingCallback, commandSystem}
     */
    this.init = function (Options) {
        parent = Options.div || document.body;

        commandSystem = Options.commandSystem || console.log;


        parent.appendChild(wrapper);

        inputText.value = ""; //clear the box

        self.hide();
    };

    this.show = function (Callback) {
        wrapper.style.display = 'block';
        closingCallback = Callback;
    };

    this.hide = function () {
        wrapper.style.display = 'none';
    };

    this.input = function() {
        inputText.focus(); //fixes input issue where key is still held down as console comes up


        if(Input.isDown("Enter") || Input.isDown("NumpadEnter")){
            inputHandler();
        }

        if(Input.isDown("Backquote")) {
            close();
        }

        if(Input.isDown("ArrowUp")) {
            commandPosition -= 1;
            if(commandPosition < 0) commandPosition = 0;
            if(listOfCommands.length !== 0){
                inputText.value = listOfCommands[commandPosition];
            }
        }

        if(Input.isDown("ArrowDown")) {
            commandPosition += 1;

            if(commandPosition >= listOfCommands.length){
                commandPosition = listOfCommands.length;
                inputText.value = "";

            }else{
                inputText.value = listOfCommands[commandPosition];
            }
        }

        Input.clearKeys();


        //console.log("from the command: ", Input);
    };


    function close() {
        self.hide();


        closingCallback()
    }

    function inputHandler() {

        listOfCommands.push(inputText.value);
        commandPosition = listOfCommands.length;


        //convert text to lowercase
        let text = inputText.value.toLowerCase();

        logger.log({
            location: 'inputHandler',
            message: "command: " + text,
        });

        //parse the text
        let command = text.split(" ");


        //check internal commands first
        switch(command[0]){
            case "supercls":
            case "scls":
                listOfCommands = [];
                commandPosition = 0;
                output.value = "";

                break;

            case "cls":
            case "clear":
                //clear the output screen
                output.value = "";
                break;

            case "hide":
            case "close":
                close();
                break;

            case 'log':
                output.value += "\n\nLogs: \n";
                let data = logger.getLogData();
                data.forEach(val => {
                    output.value += "----------------------------------------------\n";

                    let keys = Object.keys(val);


                    keys.forEach(key => {
                        output.value += key + ": " + val[key] + "\n";
                    });

                });

                break;

            case 'logoutput':
            case 'll':
                logger.output();
                break;

            default:
                output.value += commandSystem.command(command) + "\n";
        }

        output.scrollTop = output.scrollHeight;
        inputText.value = "";
    }


}

export {ConsoleCommand};