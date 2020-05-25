class Player {
    constructor(gameWidth, gameHeight) {
	this.playerWidth = 50;
	this.xSpeedIncr = 0.11;
	this.xSpeedMax = 0.6;
	this.SpeedDecay = 0.025;
	let img = document.getElementById("img1");
	img.width = this.playerWidth;
	this.playerHeight = img.height;
	this.paintPosX = gameWidth/2.0 - this.playerWidth/2.0;
	this.paintPosY = gameHeight - this.playerHeight;
	let context = main.context;
	context.drawImage(img, this.paintPosX, this.paintPosY, this.playerWidth, this.playerHeight);
    }

}

class mainApp {
    constructor(gameWidth, gameHeight) {
	this.canvas = document.createElement("canvas");
	this.canvas.width = gameWidth;
	this.canvas.height = gameHeight;
	let div = document.getElementById("div-canvas-id");
	div.appendChild(this.canvas);
	this.context = this.canvas.getContext("2d");

    }
    start = function () {
        this.context.fillStyle = "#005580";
	this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
    }
}

function startGame() {
    let gameWidth = 480;
    let gameHeight = 300;
    main = new mainApp(gameWidth, gameHeight);
    main.start();
    player = new Player(gameWidth, gameHeight);
}


