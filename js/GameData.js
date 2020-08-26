

function GameData(LoadInfo) {
    let source = LoadInfo || Settings.default;
    let gd = {};


    let keys = Object.keys(source);

    keys.forEach(key => {
        gd[key] = source[key];
    });




    return gd;
}

export {GameData};