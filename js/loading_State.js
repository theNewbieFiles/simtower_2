function Loading_State() {

    let updatedNum = 0;
    let done = false;
    let status;

    let downindicator = document.getElementById('downloading');

    let scriptLoader = new ScriptLoader();

    let List_of_scripts = ["test/testdata.js", "test/testdata2.js", "test/testdata3.js", "test/testdata4.js", "test/testdata5.js"];

    scriptLoader.download(List_of_scripts, () => {
        downindicator.innerText = "100%";
        console.log("Done");
        done = true;
    });

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
            console.log(status);
            downindicator.innerText = ((status.totalDone / status.total) * 100) + "%";

        }
    };

    this.render = function (Delta) {
        //console.log('render');
    };

}









