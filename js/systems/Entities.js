

function Entites() {
    let entities = [];

    this.createEntity = function (ID) {
        let id = ID || generateId();
        entities.push(id);

        return id;
    };

    this.deleteEntity = function (ID) {
        let index = entities.indexOf(ID);
        if(index > -1){
            entities.splice(index, 1);
        }
    };

    this.print = function () {
        console.log(entities.length, entities);
    };

    this.save = function () {
        //Todo: figure out how to save
    };

    this.load = function (Data) {
        //Todo: figure out how to load data
    }
}

/**
 * Creates a string that can be used for dynamic id attributes
 * from http://www.frontcoded.com/javascript-create-unique-ids.html
 * Example: "id-so7567s1pcpojemi"
 * @returns {string}
 */
function generateId(){
    return 'id-' + Math.random().toString(36).substr(2, 16);
}

export {Entites}