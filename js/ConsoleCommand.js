/**
 *
 * @constructor
 */
function ConsoleCommand() {
    let self = this;

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
        closingCallback = Options.closingCallback || null;

        commandSystem = Options.commandSystem || console.log;


        parent.appendChild(wrapper);

        inputText.value = ""; //clear the box

        self.hide();
    };

    this.show = function () {
        wrapper.style.display = 'block';
    };

    this.hide = function () {
        wrapper.style.display = 'none';
    };

    this.input = function(Input) {
        inputText.focus(); //fixes input issue where key is still held down as console comes up

        switch (Input.code) {
            case "Enter":
            case "NumpadEnter":
                inputHandler();

                break;

            case "Backquote":
                close();
                break;

            case "ArrowUp":
                commandPosition -= 1;
                if(commandPosition < 0) commandPosition = 0;
                if(listOfCommands.length !== 0){
                    inputText.value = listOfCommands[commandPosition];
                }

                break;

            case "ArrowDown":
                commandPosition += 1;

                if(commandPosition >= listOfCommands.length){
                    commandPosition = listOfCommands.length;
                    inputText.value = "";

                }else{
                    inputText.value = listOfCommands[commandPosition];
                }

                break;


            default:
            //do nothing
        }

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



        //parse the text
        let command = text.split(" ");


        //check internal commands first
        switch(command[0]){
            case "supercls":
                listOfCommands = [];
                commandPosition = 0;
                output.value = "";

                break;

            case "cls":
                //clear the output screen
                output.value = "";

                break;

            case "hide":
            case "close":
                close();
                break;

            default:
                output.value += commandSystem.command(command) + "\n";
        }

        output.scrollTop = output.scrollHeight;
        inputText.value = "";
    }


}

export {ConsoleCommand};