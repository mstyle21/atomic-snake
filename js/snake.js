"use strict";

import Game from "./game.js";
import Food from "./food.js";

const directions = ["up", "down", "left", "right"];
const keyCodes = {
  ArrowLeft: "left",
  ArrowUp: "up",
  ArrowRight: "right",
  ArrowDown: "down",
};

export default class Snake {
  constructor(config) {
    this.canvas = config.canvas;
    this.context = config.context;
    this.gameArea = config.gameArea;
    this.infoArea = config.infoArea;
    this.tile = config.tile;
    this.gameAreaArray = config.gameAreaArray;
    this.foodArray = config.foodArray;
    this.status = "alive";
    this.type = "player";

    this.lastUpdate = new Date().getTime();
    this.updateTime = 250;

    this.headPosition = {
      x: 0,
      y: 0,
    };
    this.bodyPosition = [];
    this.nextPosition = {};
    this.size = 2;
    this.speed = 1;
    this.direction = "";
    this.nextDirection = "down";
    this.directionProcessed = false;
    this.color = "#00e303";
    this.name = "Snake";
    this.food = {};
    this.difficulty = "Easy";
    this.increaseSizeQueue = 0;

    let snakeX = Math.floor(Math.random() * (this.tile.horizontal - 4)) + 2;
    let snakeY = Math.floor(Math.random() * (this.tile.vertical - 4)) + 2;

    this.headPosition.x = snakeX;
    this.headPosition.y = snakeY;

    this.nextPosition.x = snakeX;
    this.nextPosition.y = snakeY;

    //rewrite direction based on head position
    if (this.type === "player") {
      if (snakeX <= this.tile.horizontal / 2) {
        this.nextDirection = "down";
        if (snakeX === 0) {
          if (snakeY <= this.tile.vertical / 2) {
            this.nextDirection = "right";
          } else {
            this.nextDirection = "left";
          }
        }
      } else {
        this.nextDirection = "up";
        if (snakeX === this.tile.horizontal - 1) {
          if (snakeY > this.tile.vertical / 2) {
            this.nextDirection = "left";
          } else {
            this.nextDirection = "right";
          }
        }
      }
    }
    this.direction = this.nextDirection;

    switch (this.nextDirection) {
      case "down":
        snakeY--;
        break;
      case "up":
        snakeY++;
        break;
      case "left":
        snakeX++;
        break;
      case "right":
        snakeX--;
        break;
    }
    this.bodyPosition.push({
      x: snakeX,
      y: snakeY,
    });
  }

  start() {
    if (this.type === "player") {
      this.bindEvents();
    }

    this.status = "alive";
  }

  draw() {
    let x = this.headPosition.x * this.tile.width + this.tile.width / 2;
    let y = this.headPosition.y * this.tile.height + this.tile.height / 2;

    //draw body first to be able to draw head over body if collision
    this.bodyPosition.forEach((coords) => {
      let x = coords.x * this.tile.width;
      let y = coords.y * this.tile.height;
      this.context.beginPath();
      this.context.rect(this.gameArea.x + x, this.gameArea.y + y + 1, this.tile.width - 2, this.tile.height - 2);
      this.context.fillStyle = this.color;
      this.context.fill();
      this.context.closePath();
    });

    let radius;
    if (this.tile.width <= this.tile.height) {
      radius = this.tile.width / 2 - 2;
    } else {
      radius = this.tile.height / 2 - 2;
    }

    //draw head
    this.context.beginPath();
    this.context.arc(this.gameArea.x + x, this.gameArea.y + y, radius, 0, Math.PI * 2);
    this.context.fillStyle = this.color;
    this.context.fill();
    this.context.closePath();
  }

  nextMove() {
    let foodPositions = this.getFoodPositions();
    let roadSums = [];
    foodPositions.forEach((foodPosition, index) => {
      roadSums[index] = Math.abs(this.headPosition.x - foodPosition.x) + Math.abs(this.headPosition.y - foodPosition.y);
    });
    let min = 1000;
    let minIndex = null;
    roadSums.forEach((sum, index) => {
      if (sum < min) {
        min = sum;
        minIndex = index;
      }
    });

    if (minIndex !== null) {
      let oppositeDirection;
      switch (this.direction) {
        case "down":
          oppositeDirection = "up";
          break;
        case "up":
          oppositeDirection = "down";
          break;
        case "left":
          oppositeDirection = "right";
          break;
        case "right":
          oppositeDirection = "left";
          break;
      }
      let closestFood = foodPositions[minIndex];

      switch (this.difficulty) {
        default:
        case "Easy":
        case "Medium":
          if (Math.abs(this.headPosition.x - closestFood.x) <= Math.abs(this.headPosition.y - closestFood.y)) {
            //left and right are closer
            if (this.headPosition.x < closestFood.x && this.direction !== "left") {
              this.nextDirection = "right";
            } else if (this.headPosition.x > closestFood.x && this.direction !== "right") {
              this.nextDirection = "left";
            } else if (this.headPosition.y < closestFood.y && this.direction !== "up") {
              this.nextDirection = "down";
            } else if (this.headPosition.y > closestFood.y && this.direction !== "down") {
              this.nextDirection = "up";
            }
          } else {
            //up and down are closer
            if (this.headPosition.y < closestFood.y && this.direction !== "up") {
              this.nextDirection = "down";
            } else if (this.headPosition.y > closestFood.y && this.direction !== "down") {
              this.nextDirection = "up";
            } else if (this.headPosition.x < closestFood.x && this.direction !== "left") {
              this.nextDirection = "right";
            } else if (this.headPosition.x > closestFood.x && this.direction !== "right") {
              this.nextDirection = "left";
            }
          }
          break;
        case "Hard":
          let directionsCots = {
            left: 100,
            right: 100,
            up: 100,
            down: 100,
          };
          if (this.headPosition.x < closestFood.x) {
            directionsCots.right = closestFood.x - this.headPosition.x;
            directionsCots.left = this.headPosition.x + this.tile.horizontal - closestFood.x;
          } else if (this.headPosition.x > closestFood.x) {
            directionsCots.right = closestFood.x + this.tile.horizontal - this.headPosition.x;
            directionsCots.left = this.headPosition.x - closestFood.x;
          } else {
            directionsCots.left = directionsCots.right = 0;
          }

          if (this.headPosition.y < closestFood.y) {
            directionsCots.up = this.headPosition.y + this.tile.vertical - closestFood.y;
            directionsCots.down = closestFood.y - this.headPosition.y;
          } else if (this.headPosition.y > closestFood.y) {
            directionsCots.up = this.headPosition.y - closestFood.y;
            directionsCots.down = closestFood.y + this.tile.vertical - this.headPosition.y;
          } else {
            directionsCots.up = directionsCots.down = 0;
          }

          let minCost = 100;
          for (let direction in directionsCots) {
            if (
              directionsCots[direction] < minCost &&
              directionsCots[direction] !== 0 &&
              direction !== oppositeDirection
            ) {
              minCost = directionsCots[direction];
              this.nextDirection = direction;
            }
          }
          break;
      }
    }
  }

  avoidCollision() {
    let nextX = this.nextPosition.x;
    let nextY = this.nextPosition.y;
    switch (this.nextDirection) {
      case "down":
        if (nextY < this.tile.vertical - 1) {
          nextY++;
        } else {
          nextY = 0;
        }
        break;
      case "up":
        if (nextY > 0) {
          nextY--;
        } else {
          nextY = this.tile.vertical - 1;
        }
        break;
      case "left":
        if (nextX > 0) {
          nextX--;
        } else {
          nextX = this.tile.horizontal - 1;
        }
        break;
      case "right":
        if (nextX < this.tile.horizontal - 1) {
          nextX++;
        } else {
          nextX = 0;
        }
        break;
    }

    if (this.gameAreaArray[nextX][nextY] !== 0 && this.gameAreaArray[nextX][nextY] !== this.name + "_head") {
      let directionsAvailable = this.getAvailableDirections(this.headPosition.x, this.headPosition.y);

      let directionAvailableDirections = {};
      if (directionsAvailable.length > 1) {
        directionsAvailable.forEach((direction) => {
          switch (direction) {
            case "left":
              //check left
              let nextLeft = this.headPosition.x;
              if (nextLeft > 0) {
                nextLeft--;
              } else {
                nextLeft = this.tile.horizontal - 1;
              }
              directionAvailableDirections[direction] = this.getAvailableDirections(nextLeft, this.headPosition.y);
              break;
            case "right":
              let nextRight = this.headPosition.x;
              if (nextRight < this.tile.horizontal - 1) {
                nextRight++;
              } else {
                nextRight = 0;
              }
              directionAvailableDirections[direction] = this.getAvailableDirections(nextRight, this.headPosition.y);
              break;
            case "up":
              let nextUp = this.headPosition.y;
              if (nextUp > 0) {
                nextUp--;
              } else {
                nextUp = this.tile.vertical - 1;
              }
              directionAvailableDirections[direction] = this.getAvailableDirections(this.headPosition.x, nextUp);
              break;
            case "down":
              let nextDown = this.headPosition.y;
              if (nextDown < this.tile.vertical - 1) {
                nextDown++;
              } else {
                nextDown = 0;
              }
              directionAvailableDirections[direction] = this.getAvailableDirections(this.headPosition.x, nextDown);
              break;
          }
        });
        //get the direction with most possibilities
        let nrAvail = 0;
        for (let direction in directionAvailableDirections) {
          if (directionAvailableDirections[direction].length > nrAvail) {
            this.nextDirection = direction;
          }
        }
        console.log(directionAvailableDirections, this.nextDirection);
      } else {
      }
      this.nextDirection = directionsAvailable[Math.floor(Math.random() * directionsAvailable.length)];
    }
  }

  getFoodPositions() {
    let foodPositions = [];

    for (let x = 0; x < this.tile.horizontal; x++) {
      for (let y = 0; y < this.tile.vertical; y++) {
        if (this.foodArray[x][y] === "food") {
          foodPositions.push({
            x: x,
            y: y,
          });
        }
      }
    }

    return foodPositions;
  }

  bindEvents() {
    document.addEventListener("keydown", (e) => {
      if (
        keyCodes[e.code] !== undefined &&
        this.directionProcessed &&
        ((keyCodes[e.code] === "up" && this.direction !== "down") ||
          (keyCodes[e.code] === "down" && this.direction !== "up") ||
          (keyCodes[e.code] === "left" && this.direction !== "right") ||
          (keyCodes[e.code] === "right" && this.direction !== "left"))
      ) {
        this.nextDirection = keyCodes[e.code];
        this.directionProcessed = false;
      }
    });
  }

  move() {
    let date = new Date().getTime();
    if (date < this.lastUpdate + this.updateTime) {
      return false;
    }
    this.lastUpdate = date;

    if (this.type === "bot") {
      this.nextMove();
      this.avoidCollision();
    }

    //to avoid the case where next direction is the direction snake is coming from
    if (this.nextDirection !== this.getOppositeDirection()) {
      this.direction = this.nextDirection;
    }

    let foodPositions = this.getFoodPositions();
    let foodFound = foodPositions.find((foodPosition) => {
      if (foodPosition.x === this.headPosition.x && foodPosition.y === this.headPosition.y) {
        return foodPosition;
      }
      return false;
    });

    if (foodFound) {
      this.size += this.food.size;
      this.increaseSizeQueue += this.food.size;
      let speedAmplifier = parseInt(this.food.speedAmplifier);
      this.updateTime -= speedAmplifier;
      switch (this.difficulty) {
        default:
        case "Easy":
          this.speed += speedAmplifier;
          break;
        case "Medium":
          this.speed += speedAmplifier * 1.5;
          break;
        case "Hard":
          this.speed += speedAmplifier * 2;
          break;
      }

      this.food.generate();
    }

    if (this.increaseSizeQueue > 0) {
      this.bodyPosition.unshift({
        x: this.headPosition.x,
        y: this.headPosition.y,
      });
    }

    if (this.bodyPosition.length > 0) {
      let newBodyPosition = [];
      // if (!foodFound) {
      if (this.increaseSizeQueue === 0) {
        newBodyPosition.push({
          x: this.headPosition.x,
          y: this.headPosition.y,
        });
      }
      if (this.bodyPosition.length > 1) {
        this.bodyPosition.forEach((value, index) => {
          newBodyPosition.push({
            x: value.x,
            y: value.y,
          });
        });
        // if (!foodFound) {
        if (this.increaseSizeQueue === 0) {
          newBodyPosition.pop();
        }
      }
      this.bodyPosition = newBodyPosition;
    }

    switch (this.direction) {
      default:
        //do nothing
        break;
      case "up":
        //check if available
        if (this.headPosition.y > 0) {
          this.nextPosition.y--;
        } else {
          this.nextPosition.y = this.tile.vertical - 1;
        }
        break;
      case "down":
        if (this.headPosition.y < this.tile.vertical - 1) {
          this.nextPosition.y++;
        } else {
          this.nextPosition.y = 0;
        }
        break;
      case "left":
        if (this.headPosition.x > 0) {
          this.nextPosition.x--;
        } else {
          this.nextPosition.x = this.tile.horizontal - 1;
        }
        break;
      case "right":
        if (this.headPosition.x < this.tile.horizontal - 1) {
          this.nextPosition.x++;
        } else {
          this.nextPosition.x = 0;
        }
        break;
    }

    if (this.increaseSizeQueue > 0) {
      this.increaseSizeQueue--;
    }
    if (!this.directionProcessed) {
      this.directionProcessed = true;
    }

    this.checkCollision();
  }

  checkCollision() {
    if (
      this.gameAreaArray[this.nextPosition.x][this.nextPosition.y] !== 0 &&
      this.gameAreaArray[this.nextPosition.x][this.nextPosition.y] !== this.name + "_head"
    ) {
      this.status = "dead";
    }

    this.headPosition = this.nextPosition;
  }

  getOppositeDirection() {
    switch (this.direction) {
      case "up":
        return "down";
      case "down":
        return "up";
      case "left":
        return "right";
      case "right":
        return "left";
    }
  }

  getAvailableDirections(currentX, currentY) {
    let availableDirections = [];

    //check left
    let nextLeft = currentX;
    if (nextLeft > 0) {
      nextLeft--;
    } else {
      nextLeft = this.tile.horizontal - 1;
    }
    if (
      this.gameAreaArray[nextLeft][currentY] !== 0 &&
      this.gameAreaArray[nextLeft][currentY] !== this.name + "_head"
    ) {
    } else {
      availableDirections.push("left");
    }

    //check right
    let nextRight = currentX;
    if (nextRight < this.tile.horizontal - 1) {
      nextRight++;
    } else {
      nextRight = 0;
    }
    if (
      this.gameAreaArray[nextRight][currentY] !== 0 &&
      this.gameAreaArray[nextRight][currentY] !== this.name + "_head"
    ) {
    } else {
      availableDirections.push("right");
    }

    //check up
    let nextUp = currentY;
    if (nextUp > 0) {
      nextUp--;
    } else {
      nextUp = this.tile.vertical - 1;
    }
    if (this.gameAreaArray[currentX][nextUp] !== 0 && this.gameAreaArray[currentX][nextUp] !== this.name + "_head") {
    } else {
      availableDirections.push("up");
    }

    //check down
    let nextDown = currentY;
    if (nextDown < this.tile.vertical - 1) {
      nextDown++;
    } else {
      nextDown = 0;
    }
    if (
      this.gameAreaArray[currentX][nextDown] !== 0 &&
      this.gameAreaArray[currentX][nextDown] !== this.name + "_head"
    ) {
    } else {
      availableDirections.push("down");
    }

    return availableDirections;
  }

  debug() {
    let debugGameAreaArray = [];
    for (let i = 0; i < this.tile.horizontal; i++) {
      for (let j = 0; j < this.tile.vertical; j++) {
        if (debugGameAreaArray[j] === undefined) {
          debugGameAreaArray[j] = [];
        }
        debugGameAreaArray[j][i] = this.gameAreaArray[i][j];
      }
    }
  }
}
