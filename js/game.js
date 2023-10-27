"use strict";

import Snake from "./snake.js";
import Food from "./food.js";

export default class Game {
  constructor(options) {
    this.canvasId = "gameCanvas";
    //define game settings
    this.fps = 240;
    this.canvasHeight = window.innerHeight;
    this.gameAreaHeight = this.canvasHeight;
    this.gameAreaWidth = this.canvasHeight;
    this.canvasWidth = this.gameAreaWidth * 1.5;
    this.horizontalTiles = 20;
    this.verticalTiles = 20;
    this.tile = {
      width: this.gameAreaWidth / this.horizontalTiles,
      height: this.gameAreaHeight / this.verticalTiles,
    };
    this.gameAreaArray = [];
    this.foodArray = [];

    //define design style
    this.horizontalMiddle = this.canvasWidth / 2;
    this.infoAreaHorizontalMiddle = (this.canvasWidth - this.gameAreaWidth) / 2;

    this.welcomeTexts = [
      {
        x: this.horizontalMiddle,
        y: 100,
        text: "Welcome",
        fontSize: 80,
        textColor: "white",
      },
      {
        x: this.horizontalMiddle,
        y: 200,
        text: "to",
        fontSize: 80,
        textColor: "white",
      },
      {
        x: this.horizontalMiddle,
        y: 300,
        text: "ATOMIC SNAKE",
        fontSize: 80,
        textColor: "white",
      },
    ];
    this.singlePlayerBtn = {
      x: this.horizontalMiddle - 125,
      y: 400,
      width: 250,
      height: 50,
      text: "Single player",
      textColor: "white",
    };
    this.multiPlayerBtn = {
      x: this.horizontalMiddle - 125,
      y: 500,
      width: 250,
      height: 50,
      text: "Multi player",
      textColor: "white",
    };

    this.decreaseBotsBtn = {
      x: this.horizontalMiddle - 125,
      y: 300,
      width: 50,
      height: 50,
      text: "-",
      textColor: "white",
    };
    this.increaseBotsBtn = {
      x: this.horizontalMiddle + 75,
      y: 300,
      width: 50,
      height: 50,
      text: "+",
      textColor: "white",
    };
    this.decreaseDiffBtn = {
      x: this.horizontalMiddle - 125,
      y: 425,
      width: 50,
      height: 50,
      text: "<",
      textColor: "white",
    };
    this.increaseDiffBtn = {
      x: this.horizontalMiddle + 75,
      y: 425,
      width: 50,
      height: 50,
      text: ">",
      textColor: "white",
    };
    this.soloPlayBtn = {
      x: this.horizontalMiddle - 125,
      y: 525,
      width: 250,
      height: 50,
      text: "Play",
      textColor: "white",
    };
    this.backMenuBtn = {
      x: this.horizontalMiddle - 125,
      y: 625,
      width: 250,
      height: 50,
      text: "Back to main menu",
      textColor: "white",
    };
    this.createServerBtn = {
      x: this.horizontalMiddle - 125,
      y: 400,
      width: 250,
      height: 50,
      text: "Create server",
      textColor: "white",
    };
    this.joinServerBtn = {
      x: this.horizontalMiddle - 125,
      y: 500,
      width: 250,
      height: 50,
      text: "Join server",
      textColor: "white",
    };
    this.replayBtn = {
      x: this.infoAreaHorizontalMiddle - 125,
      y: 400,
      width: 250,
      height: 50,
      text: "Replay",
      textColor: "white",
    };
    this.gameOverBtn = {
      x: this.infoAreaHorizontalMiddle - 125,
      y: 500,
      width: 250,
      height: 50,
      text: "Main menu",
      textColor: "white",
    };
    this.nrBots = 0;
    this.maxBots = 4;
    this.difficulty = "Easy";

    this.backgroundImage = document.getElementById("backgroundImg");
  }

  init() {
    this.createCanvas();
    this.bindEvents();
    this.startMenu();
  }

  createCanvas() {
    document.body.style.margin = "0";
    let canvas = document.createElement("canvas");
    canvas.id = this.canvasId;
    canvas.height = this.canvasHeight;
    canvas.width = this.canvasWidth;

    canvas.style.display = "block";
    canvas.style.margin = "auto";

    document.body.appendChild(canvas);
    this.canvas = document.getElementById(this.canvasId);
    this.context = this.canvas.getContext("2d");
  }

  startMenu() {
    this.displayedMenu = "start";
    this.refreshStartMenu = setInterval(() => {
      this.clearCanvas();
      this.drawStartMenu();
    }, 1000 / this.fps);
  }
  drawStartMenu() {
    //make black background
    this.context.beginPath();
    this.context.rect(0, 0, this.canvasWidth, this.canvasHeight);
    this.context.fillStyle = "black";
    this.context.fill();
    this.context.closePath();

    //draw title
    this.welcomeTexts.forEach((text) => {
      this.context.font = `${text.fontSize}px serif`;
      this.context.strokeStyle = text.textColor;
      this.context.textAlign = "center";
      this.context.strokeText(text.text, text.x, text.y);
    });

    //draw single player button
    this.context.beginPath();
    this.context.rect(
      this.singlePlayerBtn.x,
      this.singlePlayerBtn.y,
      this.singlePlayerBtn.width,
      this.singlePlayerBtn.height
    );
    this.context.fillStyle = "grey";
    this.context.fill();
    this.context.lineWidth = 2;
    this.context.stroke();
    this.context.closePath();

    //write text on button
    this.context.font = "24px arial";
    this.context.fillStyle = this.singlePlayerBtn.textColor;
    this.context.fillText(
      this.singlePlayerBtn.text,
      this.singlePlayerBtn.x + this.singlePlayerBtn.width / 2,
      this.singlePlayerBtn.y + this.singlePlayerBtn.height / 2 + 8
    );

    //draw multi player button
    this.context.beginPath();
    this.context.rect(
      this.multiPlayerBtn.x,
      this.multiPlayerBtn.y,
      this.multiPlayerBtn.width,
      this.multiPlayerBtn.height
    );
    this.context.fillStyle = "grey";
    this.context.fill();
    this.context.lineWidth = 2;
    this.context.stroke();
    this.context.closePath();

    //write text on button
    this.context.font = "24px arial";
    this.context.fillStyle = this.multiPlayerBtn.textColor;
    this.context.fillText(
      this.multiPlayerBtn.text,
      this.multiPlayerBtn.x + this.multiPlayerBtn.width / 2,
      this.multiPlayerBtn.y + this.multiPlayerBtn.height / 2 + 8
    );
  }

  singlePlayerMenu() {
    this.displayedMenu = "singlePlayer";
    this.refreshSinglePlayerMenu = setInterval(() => {
      this.clearCanvas();
      this.drawSinglePlayerMenu();
    }, 1000 / this.fps);
  }
  drawSinglePlayerMenu() {
    //make black background
    this.context.beginPath();
    this.context.rect(0, 0, this.canvasWidth, this.canvasHeight);
    this.context.fillStyle = "black";
    this.context.fill();
    this.context.closePath();

    this.context.font = `80px serif`;
    this.context.strokeStyle = "white";
    this.context.textAlign = "center";
    this.context.strokeText("ATOMIC SNAKE", this.horizontalMiddle, 100);

    this.context.font = `30px serif`;
    this.context.fillStyle = "white";
    this.context.textAlign = "center";
    this.context.fillText(
      "Number of bots:",
      this.horizontalMiddle,
      this.decreaseBotsBtn.y - this.decreaseBotsBtn.height / 2
    );

    //draw decrease bots btn
    this.context.beginPath();
    this.context.rect(
      this.decreaseBotsBtn.x,
      this.decreaseBotsBtn.y,
      this.decreaseBotsBtn.width,
      this.decreaseBotsBtn.height
    );
    this.context.fillStyle = "grey";
    this.context.fill();
    this.context.lineWidth = 2;
    this.context.stroke();
    this.context.closePath();

    //write text on button
    this.context.font = "24px arial";
    this.context.fillStyle = this.decreaseBotsBtn.textColor;
    this.context.fillText(
      this.decreaseBotsBtn.text,
      this.decreaseBotsBtn.x + this.decreaseBotsBtn.width / 2,
      this.decreaseBotsBtn.y + this.decreaseBotsBtn.height / 2 + 8
    );

    //draw number of bots text
    this.context.font = `40px serif`;
    this.context.fillStyle = "white";
    this.context.textAlign = "center";
    this.context.fillText(
      this.nrBots,
      this.horizontalMiddle,
      this.decreaseBotsBtn.y + this.decreaseBotsBtn.height / 2 + 10
    );

    //draw increase bots btn
    this.context.beginPath();
    this.context.rect(
      this.increaseBotsBtn.x,
      this.increaseBotsBtn.y,
      this.increaseBotsBtn.width,
      this.increaseBotsBtn.height
    );
    this.context.fillStyle = "grey";
    this.context.fill();
    this.context.lineWidth = 2;
    this.context.stroke();
    this.context.closePath();
    //write text on button
    this.context.font = "24px arial";
    this.context.fillStyle = this.increaseBotsBtn.textColor;
    this.context.fillText(
      this.increaseBotsBtn.text,
      this.increaseBotsBtn.x + this.increaseBotsBtn.width / 2,
      this.increaseBotsBtn.y + this.increaseBotsBtn.height / 2 + 8
    );

    this.context.font = `30px serif`;
    this.context.fillStyle = "white";
    this.context.textAlign = "center";
    this.context.fillText(
      "Difficulty:",
      this.horizontalMiddle,
      this.decreaseDiffBtn.y - this.decreaseDiffBtn.height / 2
    );

    //draw decrease difficulty btn
    this.context.beginPath();
    this.context.rect(
      this.decreaseDiffBtn.x,
      this.decreaseDiffBtn.y,
      this.decreaseDiffBtn.width,
      this.decreaseDiffBtn.height
    );
    this.context.fillStyle = "grey";
    this.context.fill();
    this.context.lineWidth = 2;
    this.context.stroke();
    this.context.closePath();

    //write text on button
    this.context.font = "24px arial";
    this.context.fillStyle = this.decreaseDiffBtn.textColor;
    this.context.fillText(
      this.decreaseDiffBtn.text,
      this.decreaseDiffBtn.x + this.decreaseDiffBtn.width / 2,
      this.decreaseDiffBtn.y + this.decreaseDiffBtn.height / 2 + 8
    );

    //draw difficulty text
    this.context.font = `36px serif`;
    this.context.fillStyle = "white";
    this.context.textAlign = "center";
    this.context.fillText(
      this.difficulty,
      this.horizontalMiddle,
      this.decreaseDiffBtn.y + this.decreaseDiffBtn.height / 2 + 10
    );

    //draw increase difficulty btn
    this.context.beginPath();
    this.context.rect(
      this.increaseDiffBtn.x,
      this.increaseDiffBtn.y,
      this.increaseDiffBtn.width,
      this.increaseDiffBtn.height
    );
    this.context.fillStyle = "grey";
    this.context.fill();
    this.context.lineWidth = 2;
    this.context.stroke();
    this.context.closePath();
    //write text on button
    this.context.font = "24px arial";
    this.context.fillStyle = this.increaseDiffBtn.textColor;
    this.context.fillText(
      this.increaseDiffBtn.text,
      this.increaseDiffBtn.x + this.increaseDiffBtn.width / 2,
      this.increaseDiffBtn.y + this.increaseDiffBtn.height / 2 + 8
    );

    //draw play button
    this.context.beginPath();
    this.context.rect(this.soloPlayBtn.x, this.soloPlayBtn.y, this.soloPlayBtn.width, this.soloPlayBtn.height);
    this.context.fillStyle = "grey";
    this.context.fill();
    this.context.lineWidth = 2;
    this.context.stroke();
    this.context.closePath();
    //write text on button
    this.context.font = "24px arial";
    this.context.fillStyle = this.soloPlayBtn.textColor;
    this.context.fillText(
      this.soloPlayBtn.text,
      this.soloPlayBtn.x + this.soloPlayBtn.width / 2,
      this.soloPlayBtn.y + this.soloPlayBtn.height / 2 + 8
    );

    //draw back to main menu button
    this.context.beginPath();
    this.context.rect(this.backMenuBtn.x, this.backMenuBtn.y, this.backMenuBtn.width, this.backMenuBtn.height);
    this.context.fillStyle = "grey";
    this.context.fill();
    this.context.lineWidth = 2;
    this.context.stroke();
    this.context.closePath();
    //write text on button
    this.context.font = "24px arial";
    this.context.fillStyle = this.backMenuBtn.textColor;
    this.context.fillText(
      this.backMenuBtn.text,
      this.backMenuBtn.x + this.backMenuBtn.width / 2,
      this.backMenuBtn.y + this.backMenuBtn.height / 2 + 8
    );
  }

  multiPlayerMenu() {
    this.displayedMenu = "multiPlayer";
    this.refreshMultiPlayerMenu = setInterval(() => {
      this.clearCanvas();
      this.drawMultiPlayerMenu();
    }, 1000 / this.fps);
  }
  drawMultiPlayerMenu() {
    //make black background
    this.context.beginPath();
    this.context.rect(0, 0, this.canvasWidth, this.canvasHeight);
    this.context.fillStyle = "black";
    this.context.fill();
    this.context.closePath();

    this.context.font = `80px serif`;
    this.context.strokeStyle = "white";
    this.context.textAlign = "center";
    this.context.strokeText("ATOMIC SNAKE", this.horizontalMiddle, 100);

    //draw create server button
    this.context.beginPath();
    this.context.rect(
      this.createServerBtn.x,
      this.createServerBtn.y,
      this.createServerBtn.width,
      this.createServerBtn.height
    );
    this.context.fillStyle = "grey";
    this.context.fill();
    this.context.lineWidth = 2;
    this.context.stroke();
    this.context.closePath();
    //write text on button
    this.context.font = "24px arial";
    this.context.fillStyle = this.createServerBtn.textColor;
    this.context.fillText(
      this.createServerBtn.text,
      this.createServerBtn.x + this.createServerBtn.width / 2,
      this.createServerBtn.y + this.createServerBtn.height / 2 + 8
    );

    //draw join server button
    this.context.beginPath();
    this.context.rect(this.joinServerBtn.x, this.joinServerBtn.y, this.joinServerBtn.width, this.joinServerBtn.height);
    this.context.fillStyle = "grey";
    this.context.fill();
    this.context.lineWidth = 2;
    this.context.stroke();
    this.context.closePath();
    //write text on button
    this.context.font = "24px arial";
    this.context.fillStyle = this.joinServerBtn.textColor;
    this.context.fillText(
      this.joinServerBtn.text,
      this.joinServerBtn.x + this.joinServerBtn.width / 2,
      this.joinServerBtn.y + this.joinServerBtn.height / 2 + 8
    );

    //draw back to main menu button
    this.context.beginPath();
    this.context.rect(this.backMenuBtn.x, this.backMenuBtn.y, this.backMenuBtn.width, this.backMenuBtn.height);
    this.context.fillStyle = "grey";
    this.context.fill();
    this.context.lineWidth = 2;
    this.context.stroke();
    this.context.closePath();
    //write text on button
    this.context.font = "24px arial";
    this.context.fillStyle = this.backMenuBtn.textColor;
    this.context.fillText(
      this.backMenuBtn.text,
      this.backMenuBtn.x + this.backMenuBtn.width / 2,
      this.backMenuBtn.y + this.backMenuBtn.height / 2 + 8
    );
  }

  bindEvents() {
    this.canvas.addEventListener("mousemove", (e) => {
      this.handleMouseMovement(e);
    });

    this.canvas.addEventListener("click", (e) => {
      this.handleMouseClick(e);
    });

    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        if (this.status === "running") {
          this.context.font = "36px serif";
          this.context.fontWeight = "bold";
          this.context.fillStyle = "white";
          this.context.textAlign = "center";
          this.context.fillText("PAUSED", (this.canvasWidth - this.gameAreaWidth) / 2, 80);
          this.status = "paused";
        } else {
          this.status = "running";
        }
      }
      if (e.code === "KeyA") {
        this.snake.type = this.snake.type === "player" ? "bot" : "player";
      }
    });
  }

  handleMouseMovement(event) {
    event.preventDefault();
    event.stopPropagation();

    let mousePos = this.getMousePosition(event);

    if (this.displayedMenu === "start") {
      if (this.isInsideSinglePlayerBtn(mousePos)) {
        this.canvas.style.cursor = "pointer";
        this.singlePlayerBtn.textColor = "#0041a8";
      } else if (this.isInsideMultiPlayerBtn(mousePos)) {
        this.canvas.style.cursor = "pointer";
        this.multiPlayerBtn.textColor = "#0041a8";
      } else {
        this.canvas.style.cursor = "default";
        this.singlePlayerBtn.textColor = "white";
        this.multiPlayerBtn.textColor = "white";
      }
    }

    if (this.displayedMenu === "singlePlayer") {
      if (this.isInsideSoloPlayerBtn(mousePos)) {
        this.canvas.style.cursor = "pointer";
        this.soloPlayBtn.textColor = "#0041a8";
      } else if (this.isInsideDecreaseBotsBtn(mousePos)) {
        this.canvas.style.cursor = "pointer";
        this.decreaseBotsBtn.textColor = "#0041a8";
      } else if (this.isInsideIncreaseBotsBtn(mousePos)) {
        this.canvas.style.cursor = "pointer";
        this.increaseBotsBtn.textColor = "#0041a8";
      } else if (this.isInsideDecreaseDiffBtn(mousePos)) {
        this.canvas.style.cursor = "pointer";
        this.decreaseDiffBtn.textColor = "#0041a8";
      } else if (this.isInsideIncreaseDiffBtn(mousePos)) {
        this.canvas.style.cursor = "pointer";
        this.increaseDiffBtn.textColor = "#0041a8";
      } else if (this.isInsideBackMenuBtn(mousePos)) {
        this.canvas.style.cursor = "pointer";
        this.backMenuBtn.textColor = "#0041a8";
      } else {
        this.canvas.style.cursor = "default";
        this.soloPlayBtn.textColor = "white";
        this.decreaseBotsBtn.textColor = "white";
        this.increaseBotsBtn.textColor = "white";
        this.decreaseDiffBtn.textColor = "white";
        this.increaseDiffBtn.textColor = "white";
        this.backMenuBtn.textColor = "white";
      }
    }

    if (this.displayedMenu === "multiPlayer") {
      if (this.isInsideCreateServerBtn(mousePos)) {
        this.canvas.style.cursor = "pointer";
        this.createServerBtn.textColor = "#0041a8";
      } else if (this.isInsideJoinServerBtn(mousePos)) {
        this.canvas.style.cursor = "pointer";
        this.joinServerBtn.textColor = "#0041a8";
      } else if (this.isInsideBackMenuBtn(mousePos)) {
        this.canvas.style.cursor = "pointer";
        this.backMenuBtn.textColor = "#0041a8";
      } else {
        this.canvas.style.cursor = "default";
        this.createServerBtn.textColor = "white";
        this.joinServerBtn.textColor = "white";
        this.backMenuBtn.textColor = "white";
      }
    }

    if (this.displayedMenu === "game") {
      if (this.isInsideReplayBtn(mousePos)) {
        this.canvas.style.cursor = "pointer";
        this.replayBtn.textColor = "#0041a8";
      } else if (this.isInsideGameOverBtn(mousePos)) {
        this.canvas.style.cursor = "pointer";
        this.gameOverBtn.textColor = "#0041a8";
      } else {
        this.canvas.style.cursor = "default";
        this.replayBtn.textColor = "white";
        this.gameOverBtn.textColor = "white";
      }
    }
  }

  handleMouseClick(event) {
    event.preventDefault();
    event.stopPropagation();

    let mousePos = this.getMousePosition(event);

    if (this.isInsideSinglePlayerBtn(mousePos) && this.displayedMenu === "start") {
      clearInterval(this.refreshStartMenu);
      this.singlePlayerMenu();
    } else if (this.isInsideMultiPlayerBtn(mousePos) && this.displayedMenu === "start") {
      clearInterval(this.refreshStartMenu);
      this.multiPlayerMenu();
    } else if (this.isInsideSoloPlayerBtn(mousePos) && this.displayedMenu === "singlePlayer") {
      clearInterval(this.refreshSinglePlayerMenu);
      this.canvas.style.cursor = "default";
      this.playGame();
    } else if (this.isInsideDecreaseBotsBtn(mousePos) && this.displayedMenu === "singlePlayer") {
      if (this.nrBots > 0) {
        this.nrBots--;
      } else {
        this.nrBots = 0;
      }
    } else if (this.isInsideIncreaseBotsBtn(mousePos) && this.displayedMenu === "singlePlayer") {
      if (this.nrBots < this.maxBots) {
        this.nrBots++;
      } else {
        this.nrBots = this.maxBots;
      }
    } else if (this.isInsideDecreaseDiffBtn(mousePos) && this.displayedMenu === "singlePlayer") {
      switch (this.difficulty) {
        default:
        case "Easy":
          this.difficulty = "Hard";
          break;
        case "Medium":
          this.difficulty = "Easy";
          break;
        case "Hard":
          this.difficulty = "Medium";
          break;
      }
    } else if (this.isInsideIncreaseDiffBtn(mousePos) && this.displayedMenu === "singlePlayer") {
      switch (this.difficulty) {
        default:
        case "Easy":
          this.difficulty = "Medium";
          break;
        case "Medium":
          this.difficulty = "Hard";
          break;
        case "Hard":
          this.difficulty = "Easy";
          break;
      }
    } else if (this.isInsideCreateServerBtn(mousePos) && this.displayedMenu === "multiPlayer") {
      clearInterval(this.refreshMultiPlayerMenu);
      this.canvas.style.cursor = "default";
      this.playGame();
    } else if (this.isInsideJoinServerBtn(mousePos) && this.displayedMenu === "multiPlayer") {
    } else if (this.isInsideReplayBtn(mousePos) && this.displayedMenu === "game") {
      clearInterval(this.refreshCanvas);
      this.playGame();
    } else if (this.isInsideGameOverBtn(mousePos) && this.displayedMenu === "game") {
      clearInterval(this.refreshCanvas);
      this.startMenu();
    } else if (
      this.isInsideBackMenuBtn(mousePos) &&
      (this.displayedMenu === "singlePlayer" || this.displayedMenu === "multiPlayer")
    ) {
      clearInterval(this.refreshSinglePlayerMenu);
      clearInterval(this.refreshMultiPlayerMenu);
      this.startMenu();
    }
  }

  playGame(type = "singlePlayer") {
    this.displayedMenu = "game";
    this.generateGameAreaArray();

    const config = {
      canvas: this.canvas,
      context: this.context,
      infoArea: {
        x: 0,
        y: 0,
        width: this.canvasWidth - this.gameAreaWidth,
        height: this.gameAreaHeight,
      },
      gameArea: {
        x: this.canvasWidth - this.gameAreaWidth,
        y: this.canvasHeight - this.gameAreaHeight,
        width: this.gameAreaWidth,
        height: this.gameAreaHeight,
      },
      tile: {
        width: this.tile.width,
        height: this.tile.height,
        horizontal: this.horizontalTiles,
        vertical: this.verticalTiles,
      },
      gameAreaArray: this.gameAreaArray,
      foodArray: this.foodArray,
    };

    let players = [];
    this.food = new Food(config);
    this.food.generate();

    if (this.nrBots > 0) {
      let availableColors = ["#c90404", "#ab9101", "#ab04af", "#00fff5"];
      for (let i = 0; i < this.nrBots; i++) {
        let snakeBot = new Snake(config);
        snakeBot.name = `bot${i + 1}`;
        snakeBot.type = "bot";
        snakeBot.color = availableColors.pop();
        snakeBot.difficulty = this.difficulty;
        players.push(snakeBot);
        snakeBot.start();
      }
    }

    this.snake = new Snake(config);
    players.push(this.snake);
    this.snake.start();
    //debug
    // this.snake.type = 'bot';
    // this.snake.difficulty = 'Hard';

    this.players = players;
    this.updateGameAreaArray();
    this.startTime = new Date();
    this.status = "running";
    this.refreshCanvas = setInterval(() => {
      if (this.status === "paused") {
        return false;
      }
      this.clearCanvas();
      this.drawGameArea();
      this.drawInfoArea();
      this.food.draw();
      this.food.gameAreaArray = this.gameAreaArray;
      players.forEach((snake, index) => {
        if (snake.status === "dead") {
          players = players.filter((item) => item !== snake);
        }
        snake.food = this.food;
        snake.gameAreaArray = this.gameAreaArray;
        snake.foodArray = this.foodArray;
        snake.move();
        snake.draw();
        this.updateGameAreaArray();
      });

      if (this.nrBots > 0 && players.length === 1 && this.snake.status === "alive") {
        this.gameOver(players, "CONGRATULATIONS");
      }

      if (this.snake.status === "dead") {
        this.gameOver(players, "GAME OVER");
      }
    }, 1000 / this.fps);
  }

  gameOver(players, status) {
    this.status = "over";
    this.clearCanvas();
    this.drawGameArea();
    this.drawInfoArea();
    this.food.draw();
    players.forEach((snake, index) => {
      if (snake.status === "alive") {
        snake.draw();
      }
    });
    this.snake.draw();
    this.context.font = "36px serif";
    this.context.fontWeight = "bold";
    this.context.fillStyle = "white";
    this.context.textAlign = "center";
    this.context.fillText("GAME OVER", (this.canvasWidth - this.gameAreaWidth) / 2, this.canvasHeight / 6 - 50);
    clearInterval(this.refreshCanvas);

    //draw replay button
    this.context.beginPath();
    this.context.rect(this.replayBtn.x, this.replayBtn.y, this.replayBtn.width, this.replayBtn.height);
    this.context.fillStyle = "grey";
    this.context.fill();
    this.context.lineWidth = 2;
    this.context.stroke();
    this.context.closePath();
    //write text on button
    this.context.font = "24px arial";
    this.context.fillStyle = this.replayBtn.textColor;
    this.context.fillText(
      this.replayBtn.text,
      this.replayBtn.x + this.replayBtn.width / 2,
      this.replayBtn.y + this.replayBtn.height / 2 + 8
    );

    //draw game over button
    this.context.beginPath();
    this.context.rect(this.gameOverBtn.x, this.gameOverBtn.y, this.gameOverBtn.width, this.gameOverBtn.height);
    this.context.fillStyle = "grey";
    this.context.fill();
    this.context.lineWidth = 2;
    this.context.stroke();
    this.context.closePath();
    //write text on button
    this.context.font = "24px arial";
    this.context.fillStyle = this.gameOverBtn.textColor;
    this.context.fillText(
      this.gameOverBtn.text,
      this.gameOverBtn.x + this.gameOverBtn.width / 2,
      this.gameOverBtn.y + this.gameOverBtn.height / 2 + 8
    );
  }

  getMousePosition(e) {
    let rect = this.canvas.getBoundingClientRect();

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  isInsideSinglePlayerBtn(mousePos) {
    return (
      mousePos.x > this.singlePlayerBtn.x &&
      mousePos.x < this.singlePlayerBtn.x + this.singlePlayerBtn.width &&
      mousePos.y > this.singlePlayerBtn.y &&
      mousePos.y < this.singlePlayerBtn.y + this.singlePlayerBtn.height
    );
  }
  isInsideMultiPlayerBtn(mousePos) {
    return (
      mousePos.x > this.multiPlayerBtn.x &&
      mousePos.x < this.multiPlayerBtn.x + this.multiPlayerBtn.width &&
      mousePos.y > this.multiPlayerBtn.y &&
      mousePos.y < this.multiPlayerBtn.y + this.multiPlayerBtn.height
    );
  }
  isInsideSoloPlayerBtn(mousePos) {
    return (
      mousePos.x > this.soloPlayBtn.x &&
      mousePos.x < this.soloPlayBtn.x + this.soloPlayBtn.width &&
      mousePos.y > this.soloPlayBtn.y &&
      mousePos.y < this.soloPlayBtn.y + this.soloPlayBtn.height
    );
  }
  isInsideDecreaseBotsBtn(mousePos) {
    return (
      mousePos.x > this.decreaseBotsBtn.x &&
      mousePos.x < this.decreaseBotsBtn.x + this.decreaseBotsBtn.width &&
      mousePos.y > this.decreaseBotsBtn.y &&
      mousePos.y < this.decreaseBotsBtn.y + this.decreaseBotsBtn.height
    );
  }
  isInsideIncreaseBotsBtn(mousePos) {
    return (
      mousePos.x > this.increaseBotsBtn.x &&
      mousePos.x < this.increaseBotsBtn.x + this.increaseBotsBtn.width &&
      mousePos.y > this.increaseBotsBtn.y &&
      mousePos.y < this.increaseBotsBtn.y + this.increaseBotsBtn.height
    );
  }
  isInsideDecreaseDiffBtn(mousePos) {
    return (
      mousePos.x > this.decreaseDiffBtn.x &&
      mousePos.x < this.decreaseDiffBtn.x + this.decreaseDiffBtn.width &&
      mousePos.y > this.decreaseDiffBtn.y &&
      mousePos.y < this.decreaseDiffBtn.y + this.decreaseDiffBtn.height
    );
  }
  isInsideIncreaseDiffBtn(mousePos) {
    return (
      mousePos.x > this.increaseDiffBtn.x &&
      mousePos.x < this.increaseDiffBtn.x + this.increaseDiffBtn.width &&
      mousePos.y > this.increaseDiffBtn.y &&
      mousePos.y < this.increaseDiffBtn.y + this.increaseDiffBtn.height
    );
  }
  isInsideCreateServerBtn(mousePos) {
    return (
      mousePos.x > this.createServerBtn.x &&
      mousePos.x < this.createServerBtn.x + this.createServerBtn.width &&
      mousePos.y > this.createServerBtn.y &&
      mousePos.y < this.createServerBtn.y + this.createServerBtn.height
    );
  }
  isInsideJoinServerBtn(mousePos) {
    return (
      mousePos.x > this.joinServerBtn.x &&
      mousePos.x < this.joinServerBtn.x + this.joinServerBtn.width &&
      mousePos.y > this.joinServerBtn.y &&
      mousePos.y < this.joinServerBtn.y + this.joinServerBtn.height
    );
  }
  isInsideBackMenuBtn(mousePos) {
    return (
      mousePos.x > this.backMenuBtn.x &&
      mousePos.x < this.backMenuBtn.x + this.backMenuBtn.width &&
      mousePos.y > this.backMenuBtn.y &&
      mousePos.y < this.backMenuBtn.y + this.backMenuBtn.height
    );
  }
  isInsideReplayBtn(mousePos) {
    return (
      mousePos.x > this.replayBtn.x &&
      mousePos.x < this.replayBtn.x + this.replayBtn.width &&
      mousePos.y > this.replayBtn.y &&
      mousePos.y < this.replayBtn.y + this.replayBtn.height
    );
  }
  isInsideGameOverBtn(mousePos) {
    return (
      mousePos.x > this.gameOverBtn.x &&
      mousePos.x < this.gameOverBtn.x + this.gameOverBtn.width &&
      mousePos.y > this.gameOverBtn.y &&
      mousePos.y < this.gameOverBtn.y + this.gameOverBtn.height
    );
  }

  drawInfoArea() {
    //set game title
    this.context.font = "36px serif";
    this.context.strokeStyle = "white";
    this.context.textAlign = "center";
    this.context.strokeText("ATOMIC SNAKE", (this.canvasWidth - this.gameAreaWidth) / 2, 50);

    //set title
    if (this.status !== "over") {
      this.context.font = "28px serif";
      this.context.fillStyle = "white";
      this.context.textAlign = "center";
      this.context.fillText("Current game", (this.canvasWidth - this.gameAreaWidth) / 2, this.canvasHeight / 6);
    }

    //set game time
    let currentTime = new Date();
    let diff = currentTime - this.startTime;
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    let microSeconds = 0;
    if (diff < 1000) {
      microSeconds = diff;
    } else {
      seconds = Math.floor(diff / 1000);
      microSeconds = diff - seconds * 1000;
      if (seconds >= 60) {
        minutes = Math.floor(seconds / 60);
        seconds = seconds - minutes * 60;
      }
    }
    if (minutes >= 60) {
      hours = Math.floor(minutes / 60);
      minutes = minutes - hours * 60;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (hours < 10) {
      hours = "0" + hours;
    }

    let leaderboardHeight = this.canvasHeight / 4;
    this.context.font = "24px serif";
    this.context.fillStyle = "white";
    this.context.textAlign = "left";
    this.context.fillText(`Leaderboard`, 5, leaderboardHeight);

    let players = this.players.sort((a, b) => {
      return b.size - a.size;
    });

    let placeNr = 1;
    players.forEach((player) => {
      leaderboardHeight += 30;
      this.context.font = "24px serif";
      this.context.fillStyle = `${player.color}`;
      this.context.textAlign = "left";
      let status = "";
      if (player.status === "dead") {
        this.context.fillStyle = "lightgrey";
        status = "(dead)";
      }
      let playerName = player.name;
      if (player === this.snake && player.type === "bot") {
        playerName += " (A)";
      }
      this.context.fillText(`#${placeNr}. ${playerName}   ${player.size} ${status}`, 50, leaderboardHeight);
      placeNr++;
    });

    this.context.font = "24px serif";
    this.context.fillStyle = "white";
    this.context.textAlign = "left";
    this.context.fillText(`Time: ${hours}:${minutes}:${seconds}.${microSeconds}`, 5, leaderboardHeight + 50);
  }

  drawGameArea() {
    // this.context.beginPath();
    // this.context.rect(this.canvasWidth - this.gameAreaWidth, 0, this.canvasWidth, this.canvasHeight);
    // this.context.fillStyle = 'black';
    // this.context.fill();
    // this.context.closePath();

    this.context.drawImage(this.backgroundImage, 0, 0, this.canvasWidth, this.canvasHeight);

    this.context.beginPath();
    this.context.rect(0, 0, this.canvasWidth, this.canvasHeight);
    this.context.fillStyle = "rgba(0, 0, 0, 0.7)";
    this.context.fill();
    this.context.closePath();

    for (let i = 0; i <= this.horizontalTiles + 1; i++) {
      this.context.moveTo(this.canvasWidth - this.gameAreaWidth + i * this.tile.width - 1, 0);
      this.context.lineTo(this.canvasWidth - this.gameAreaWidth + i * this.tile.width - 1, this.canvasHeight);
      this.context.strokeStyle = "white";
      this.context.stroke();
    }

    for (let j = 1; j < this.verticalTiles + 1; j++) {
      this.context.moveTo(this.canvasWidth - this.gameAreaWidth, j * this.tile.height);
      this.context.lineTo(this.canvasWidth, j * this.tile.height);
      this.context.strokeStyle = "white";
      this.context.stroke();
    }
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  generateGameAreaArray() {
    this.gameAreaArray = [];
    this.foodArray = [];
    for (let i = 0; i < this.horizontalTiles; i++) {
      this.gameAreaArray[i] = [];
      this.foodArray[i] = [];
      for (let j = 0; j < this.verticalTiles; j++) {
        this.gameAreaArray[i][j] = 0;
        this.foodArray[i][j] = 0;
      }
    }
  }

  updateGameAreaArray() {
    this.gameAreaArray = [];
    this.foodArray = [];
    for (let i = 0; i < this.horizontalTiles; i++) {
      this.gameAreaArray[i] = [];
      this.foodArray[i] = [];
      for (let j = 0; j < this.verticalTiles; j++) {
        this.gameAreaArray[i][j] = 0;
        this.foodArray[i][j] = 0;
      }
    }

    this.players.forEach((snake) => {
      if (snake.status === "alive") {
        this.gameAreaArray[snake.headPosition.x][snake.headPosition.y] = snake.name + "_head";

        if (snake.bodyPosition.length > 0) {
          snake.bodyPosition.forEach((value) => {
            this.gameAreaArray[value.x][value.y] = snake.name + "_body";
          });
        }
      }
    });

    this.foodArray[this.food.position.x][this.food.position.y] = "food";
  }
}
