import {Vector3} from "../threejs/three.module";

function CameraSystem() {
    let mainCamera = null;
    let distance = 10;
    let lookingAt = null;
    let target = null;

    let mainPosition = new Vector3();
    let positions = {};

    this.setDistance = function (Value) {
        distance = Value;
    };
    this.getDistance = function () {
        return distance;
    };

    this.setMainPosition = function (Vec) {
        mainPosition.copy(Vec);
    };

    this.returnMainPosition = function () {
        mainCamera.position.copy(mainPosition)
    };

    /**
     *
     * @param Name {String}
     * @param Vector {Vector3};
     */
    this.createPosition = function (Name, Vector) {
        positions[Name] = Vector;
        //console.log(positions)
    };

    this.setPositionFrom = function (Name) {
        this.lookAt(positions[Name]);

    };

    this.setCamera = function (Camera) {
        mainCamera = Camera;
    };


    this.setPosition = function (X, Y, Z) {
        mainCamera.position.set(X + mainPosition.x, Y + mainPosition.y, Z + mainPosition.z);
    };

    this.getCurrentPosition = function () {
        return mainCamera.position;
    }

    this.lookAt = function (Vec) {
        mainCamera.position.set(Vec.x + distance, Vec.y + distance, Vec.z + distance);

        mainCamera.lookAt(Vec);

        lookingAt = Vec;
    };

    this.recalculate = function () {
        mainCamera.position.setX(lookingAt.x + distance);
        mainCamera.position.setY(lookingAt.y + distance);
        mainCamera.position.setZ(lookingAt.z + distance);
    };

    this.update = function () {
        //check if tracking something
    }
}

export {CameraSystem}