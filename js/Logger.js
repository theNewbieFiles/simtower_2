function Logger() {
    let logData = [];



    this.log = function (Value) {

        let val = {};

        if(Value.location) val.location = Value.location;

        val.time = Value.time || performance.now();
        val.level = Value.level || "log";

        val.message = Value.message || Value;
        if(Value.info) val.info = Value.info;

        logData.push(val);
    };

    this.getLogData = function () {
        return logData;
    };

    this.output = function () {
        logData.forEach(Data => {
            console[Data.level](Data);
        })
    };


    this.log("Created");
}

export {Logger}