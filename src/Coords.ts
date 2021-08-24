

export class Coords {

    _x: number;
    _y: number;

    constructor(x: number, y: number) {

        this._x = x;
        this._y = y;

    }

    static getNewCoord(maximum_x: number, maximum_y: number, minimum_x?: number, minimum_y?: number) {

        if (minimum_x != undefined)
            var x: number = Math.random() * (maximum_x - minimum_x) + minimum_x;
        else
            var x = Math.random() * maximum_x;
        
        if (minimum_y != undefined)
            var y: number = Math.random() * (maximum_y - minimum_y) + minimum_y;
        else
            var y = Math.random() * maximum_x;
        
        return new Coords(x, y);
        
    }

    detect(other: Coords, radius: number, radius2: number): boolean {

        let distSq = (this.x - other.x) * (this.x - other.x) +
                     (this.y - other.y) * (this.y - other.y);
        let radSumSq = (radius + radius2) * (radius + radius2);

        if (distSq <= radSumSq) 
            return true;

        return false;

    }

    get x() {
        return this._x;
    }
    set x(value: number) {
       this. _x = value;
    }

    get y() {
        return this._y;
    }
    set y(value: number) {
       this. _y = value;
    }

}