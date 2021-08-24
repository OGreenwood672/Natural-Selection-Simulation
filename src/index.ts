import p5 from "p5";
import { Basic_Spot, Animal } from "./basic_spot";
import { Coords } from "./Coords";

const frameRate: number = 60;
const foodAmount: number = 200;
const foodSize: number = 3;
const numberOfAnimals: number = 100;
const sense: number = 25;
const speed: number = 60;
const animalSize: number = 7;
const energy: number = 100000;

let length: number;
let edge: number;

const sketch = (p5: p5) => {

    length = p5.windowHeight * 0.97;
    edge = 0.05 * length;

    var food: Array<Basic_Spot> = getFood(foodAmount);

    var animals: Array<Animal> = getAnimals(numberOfAnimals);    

    p5.setup = () => {

        p5.createCanvas(length, length);
        p5.frameRate(frameRate);

    }

    p5.draw = () => {

        p5.background(50);

        p5.beginShape();
        p5.fill(0, 255, 0);
        food.forEach(f => {
            p5.circle(f.coord.x, f.coord.y, f.size * 2);
        })

        p5.fill(0, 0, 255);
        animals.forEach(animal => {
            p5.circle(animal.coord.x, animal.coord.y, animal.size * 2);

            if (animal.isMoving) {
                food.forEach(f => {
                    if (animal.hasCollided(f)) {

                        animal.food++;
                        food = food.filter(x => x != f);

                    } else if (animal.hasSensed(f)) {

                        animal.target = f.coord;

                    } else if (animal.food > 1) {

                        animal.target = animal.findNearestEdge(length);

                    }
                })

                move(animal);
                
                animal.target = null;
            }

            if (animal.isTouchingWall(length)) {

                animal.checkFood();
                
            }

            if (animal.energy <= 0) {

                animals = animals.filter(a => a != animal);

            }
        
        
        })

        p5.endShape();

        let finished = animals.every(animal => {
            return !animal.isMoving;
        })
        if (finished) {

            var newValues: updatedSpots;
            newValues = resetCycle(food, animals);

            food = newValues.food;
            animals = newValues.animals;

        }

        if (animals.length === 0)
            p5.noLoop();

    }

}

function move(animal: Animal) {

    if (animal.target == null)
        animal.randomMovement(length);
    else
        animal.moveToTarget();

    animal.energy -= animal.speed * 2 + animal.sense + animal.size;

}

function resetCycle(food: Array<Basic_Spot>, animals: Array<Animal>): updatedSpots {

    food = getFood(foodAmount);

    animals.forEach(animal => {
        animal.isMoving = true;
        animal.energy = energy;
        if (animal.readyToReproduce)
            animals.push(animal.getChild(length, edge, animalSize))
    })

    var returnValues: updatedSpots = { food, animals };
    return returnValues;

}

function getFood(foodAmount: number): Array<Basic_Spot> {

    let max = length - edge - foodSize;
    let min = edge + foodSize

    var food: Array<Basic_Spot> = [];
    for (let i=0; i<foodAmount; i++) {
        
        var coords: Coords = Coords.getNewCoord(max, max, min, min);

        food.push(new Basic_Spot(coords, foodSize));
    }

    return food;

}

function getAnimals(numberOfAnimals: number): Array<Animal> {

    var newAnimals: Array<Animal> = [];
    for (let i=0; i<numberOfAnimals; i++) {

        newAnimals.push(new Animal(Animal.getAnimalCoords(length, edge, animalSize), animalSize, sense, speed, energy));

    }

    return newAnimals;

}

interface updatedSpots {
    food: Array<Basic_Spot>,
    animals: Array<Animal>
}


new p5(sketch);
