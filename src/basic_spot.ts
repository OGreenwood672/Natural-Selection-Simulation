import { Coords } from "./Coords";

const frameRate = 60;

class Basic_Spot {

    coord: Coords;

    _size: number;

    constructor(coord: Coords, size: number) {

        this.coord = coord;

        this._size = size;

    }

    get size() {
        return this._size;
    }
    set size(value: number) {
        this._size = value;
    }

}

class Animal extends Basic_Spot {

    _speed: number;
    _sense: number;
    
    angle: number = 0;
    food: number = 0;
    target: null | Coords = null;

    isMoving = true;

    _energy: number;

    readyToReproduce = false;

    constructor(coord: Coords, size: number, sense: number, speed: number, energy: number) {

        super(coord, size);
        
        this._speed = speed;
        this._sense = sense;
        this._energy = energy

    }

    hasSensed(other: Basic_Spot | Animal): boolean {

        return this.coord.detect(other.coord, this.size + this.sense, other.size);

    }


    hasCollided(other: Basic_Spot | Animal): boolean {

        return this.coord.detect(other.coord, this.size, other.size);

    }

    randomMovement(length: number) {

        let directionChange = Math.random() - 0.5;
        this.angle += directionChange;

        this.coord.x = clamp(Math.cos(this.angle) * (this.speed / frameRate) + this.coord.x, this.size, length - this.size);
        this.coord.y = clamp(Math.sin(this.angle) * (this.speed / frameRate) + this.coord.y, this.size, length - this.size);

    }

    moveToTarget() {

        if (this.target) {
            var delta_x: number = this.target.x - this.coord.x;
            var delta_y: number = this.target.y - this.coord.y;
            var distToTarget: number = Math.sqrt(delta_x * delta_x + delta_y * delta_y);
            
            this.coord.x = (delta_x / distToTarget) * (this.speed / frameRate) + this.coord.x;
            this.coord.y = (delta_y / distToTarget) * (this.speed / frameRate) + this.coord.y;
        }

    }

    isTouchingWall(length: number): boolean {

        var max_x: boolean = Math.ceil(this.coord.x) >= length - this.size;
        var min_x: boolean = Math.floor(this.coord.x) == this.size;
        var max_y: boolean = Math.ceil(this.coord.y) >= length - this.size;
        var min_y: boolean = Math.floor(this.coord.y) == this.size;

        return max_x || min_x || max_y || min_y;

    }

    checkFood() {

        if (this.food === 1) {

            this.isMoving = false;
            this.food = 0;

        } else if (this.food > 1) {

            this.food = 0;
            this.isMoving = false;
            this.readyToReproduce = true;

        }

    }

    getChild(length: number, edge: number, defaultAnimalSize: number): Animal {

        var newCoords: Coords = Animal.getAnimalCoords(length, edge, defaultAnimalSize);
        var newSize: number = this.size + (Math.random() - 0.5)
        var newSense: number = this.sense + (Math.random() * 5 - 2.5)
        var newSpeed: number = this.speed + (Math.random() * 10 - 5)

        return new Animal(newCoords, newSize, newSense, newSpeed, this.energy)

    }

    findNearestEdge(length: number) {

        var top: number = this.coord.y;
        var right: number = length - this.coord.x;
        var bottom: number = length - this.coord.y;
        var left: number = this.coord.x;

        if (top < right && top < left && top < bottom)
            return new Coords(this.coord.x, this.size);
        else if (right < top && right < left && right < bottom)
            return new Coords(length - this.size, this.coord.y);
        else if (left < top && left < right && left < bottom)
            return new Coords(this.size, this.coord.y);
        else
            return new Coords(this.coord.x, length - this.size);

    }

    static getAnimalCoords(length: number, edge: number, animalSize: number) {

        var coords: Coords = new Coords(0, 0);

        var t: number = Math.ceil(Math.random() * 4);
        switch (t) {
            case 1:
                coords = Coords.getNewCoord(length - edge - animalSize, edge - animalSize, animalSize, animalSize);
                break;
            case 2:
                coords = Coords.getNewCoord(length - animalSize, length - edge - animalSize, length - edge + animalSize, animalSize);
                break;
            case 3:
                coords = Coords.getNewCoord(edge + animalSize, length - animalSize, length - animalSize, length - edge - animalSize);
                break;
            case 4:
                coords = Coords.getNewCoord(animalSize, length - animalSize, edge - animalSize, edge + animalSize);
                break;
            default:
                break;
        }

        
        return coords;

    }


    get speed() {
        return this._speed;
    }
    set speed(value: number) {
        this._speed = value;
    }

    get sense() {
        return this._sense;
    }
    set sense(value: number) {
        this._sense = value;
    }

    get energy() {
        return this._energy;
    }
    set energy(value: number) {
        this._energy = value;
    }

}

function clamp(n: number, min: number, max: number) {

    return Math.min(Math.max(min, n), max);

}

export {
    Basic_Spot, 
    Animal
}