function Loading_State() {

    Load_Scripts("js/Settings.js",
        //update
        update => {
        console.log(update);
        },

        //error
        error => {
            alert(error)
        },

        //callback
        () => {
        console.log("done")
        }

    );


    this.update = function (Delta) {
        console.log(Delta);
    };

    this.render = function (Delta) {
        console.log('render');
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


    function done(){
        length--;
        update(total - length, total);

        if(length === 0){
            callback();
        }
    }

    List_of_scripts.forEach(Script => {
        let script = document.createElement('script');
        script.type = "text/javascript";

        script.onload = ()=>{
            done();

        };

        script.onerror = () => {
            error(Script, 'Failed to load');

            console.error(Script + " Failed to load")
        };

        script.src = Script;

        document.head.appendChild(script);

    });

}