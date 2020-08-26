

function GameData(LoadInfo) {
    let gd = {};

    if(LoadInfo){

    }else{
        let keys = Object.keys(Settings.default);

        keys.forEach(key => {
            gd[key] = Settings.default[key];
        });
    }





    return gd;
}

export {GameData};