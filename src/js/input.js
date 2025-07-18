export default class Input {
    points = new Array();
    constructor() {
    }
    clear() {
        this.points.length = 0;
    }
    isValidPoint(point) {
        return false;
    }
    addPoint(point) {
        this.points.push(point);
    }
}
