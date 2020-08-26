import {Object3D} from "../threejs/three.module";


function Components() {

}

function VisualComponent() {
    let visual = new Map();
    let scene;

    function setScene(Scene) {
        scene = Scene;
    }

    function create(ID, Obj) {
        Obj = Obj || new Object3D();

        Obj.name = ID;

        //add it to the list
        visual.set(ID, Obj);

        //add it to the scene
        scene.add(Obj);
    }

    function remove(ID) {
        let obj = visual.get(ID);

        //loop thru the object3d's children and properly dispose of any meshes
        for(let i = 0; i < obj.children.length; i += 1){
            let item = obj.children[i];

            if(item.type === 'Mesh'){
                item.geometry.dispose();
                item.material.dispose();
            }
        }

        //remove it from the scene
        scene.remove(obj);

        //remove it from the list
        visual.delete(ID);
    }

    function get(ID) {
        return visual.get(ID)
    }

    function print(ID) {
        console.log(visual.size);
        if(visual.size === 0){
            console.log("No components.");
            return
        }
        console.log("printing list of visual components");
        if(ID){
            console.log(visual.get(ID));
        }else{
            visual.forEach((Value, Key) => {
                console.log(Key, Value);
            })
        }
    }

    function toggleVisibility(ID) {
        let obj = visual.get(ID);

        obj.visible = !obj.visible;
    }

    function visible(ID, Value) {
        visual.get(ID).visible = Value;
    }

    return {
        setScene: setScene,
        create: create,
        get: get,
        remove: remove,
        print: print,
        toggleVisibility: toggleVisibility,
        visible: visible,
    }
}


function HealthComponent() {
    let hp = new Map();

    function create(ID, Current, Max) {
        hp.set(ID, {c: Current || 100, m: Max || 100});

    }

    function get(ID) {
        return hp.get(ID);
    }

    function remove(ID) {
        hp.delete(ID);
    }

    function print(ID) {
        if(ID){
            console.log(hp.get(ID));
        }else{
            hp.forEach((Value, Key) => {
                console.log(Key, Value);
            })
        }
    }

    return {
        create: create,
        get: get,
        remove: remove,
        print: print,
    }


}





export {Components, HealthComponent, VisualComponent}

