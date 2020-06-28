function Loading_State() {

    let updatedNum = 0;
    let done = false;
    let status;

    let scriptLoader = new ScriptLoader();

    let List_of_scripts = ["test/testdata.js", "test/testdata2.js", "test/testdata3.js"];

    /*Load_Scripts(,
        //update
        update => {
        updatedNum = update;
        },

        //error
        error => {
            alert("There was a error: " +error)
        },

        //callback
        () => {
        console.log("done");
        done = true;
        }

    );*/


    this.update = function (Delta) {
        if(!done){
            status = scriptLoader.status();
console.log(status)
            if(!status.completed){

                console.log(status);
            }else{
                done = true;
                console.log('done');
            }
        }
    };

    this.render = function (Delta) {
        //console.log('render');
    };

    List_of_scripts.forEach(Script => {

        scriptLoader.addScript(Script);

    });
}



function ScriptLoader(){

    let script = [];
    let total = 0;
    let totalDone = 0;
    let done = false;
    let downloading = false;


    this.addScript = function(Script) {
        script.push(Script);

        total = script.length;


        done = false;

        checkLoading();


    };

    function loadScript(Script) {
        downloading = true;

        let script = document.createElement('script');

        script.type = "text/javascript";

        script.onload = () => {
            downloading = false;
            totalDone += 1;
            checkLoading();
        };

        script.onerror = error => {
            downloading = false;
            console.log(error);
            checkLoading()
        };

        script.src = Script;

        document.head.appendChild(script);

    }

    function checkLoading() {
        if(!done){
            if(script.length){
                if(!downloading){
                    loadScript(script.pop());
                }

            }else{
                done = true;
            }
        }
    }

    this.status = function() {
        return {
            total: total,
            totalDone: totalDone,
            completed: !script.length
        }
    }

    this.checkDone = function() {

        if(script.length === 0 && downloading === false){
            return true;
        }

        return false;
    };

    this.reset = function() {
        totalDone =0;
        total = 0;
        done = false;
        script = [];
    }
}



//script loader
function Load_Scripts(List_of_scripts, update, error, callback) {
    if(!Array.isArray(List_of_scripts)){
        //an array wasn't given
        List_of_scripts = [List_of_scripts];
    }
    let length = List_of_scripts.length;
    let total = List_of_scripts.length;


    function done(Script){
        console.log(Script);
        length--;
        update(total - length, total);

        if(length === 0){
            callback();
        }
    }

    List_of_scripts.forEach(Script => {
        let script = document.createElement('script');
        script.async = false; //true;
        script.type = "text/javascript";

        script.onload = ()=>{
            console.log(" I'm done ")
            done(script);

        };

        script.onerror = () => {
            error(Script, 'Failed to load');

            console.error(Script + " Failed to load")
        };

        script.src = Script;

        document.head.appendChild(script);

        //console.log(script)

    });

}