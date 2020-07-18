function ScriptLoader(){
    let listOfFiles;
    let callback;

    let total = 0;
    let totalDone = 0;
    let done = false;
    let downloading = false;



    this.download = function(ListOfFiles, Callback) {
        if(!Array.isArray(ListOfFiles)){
            ListOfFiles = [ListOfFiles];
        }

        listOfFiles = ListOfFiles;

        total = ListOfFiles.length;

        callback = Callback;




        listOfFiles.forEach(Element => {

            let script = document.createElement('script');
            script.type = "text/javascript";

            script.onload = ()=>{
                console.log(listOfFiles)
                totalDone += 1;

                let index = listOfFiles.indexOf(Element);

                if(index > -1){
                    listOfFiles.splice(index, 1);
                }

                checkLoading();

            };

            script.onerror = () => {
                alert(Element + " Failed to load");
                console.error(Element + " Failed to load");

                //todo: try to find a way to attempt to download the file again.
            };

            script.src = Element;

            document.head.appendChild(script);
        })


    };


    function checkLoading() {
        if(listOfFiles.length === 0){
            callback();
        }
    }

    this.status = function() {
        return {
            total: total,
            totalDone: totalDone
        }
    }

}