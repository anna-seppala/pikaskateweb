/* Main skeleton of the javascript game. It follows the Model-View-Controller
 * method with game.js representing the model (game logic), display.js the view
 * (painting of world and player), and controller.js the controller (taking
 * user input and deciding how to handle it).*/

/*The last part, engine.js, combines the MVC components to create a functional
 * game entity. The template for the game strongly relies on the rabbit-trap
 * tutorial by Frank Poth*/
 
// only execute if html page finished loading
window.addEventListener("load", function(event) {
    "use strict"; // improved (stricter) javascript writing

    let keyDownUp = function(event) {
	controller.keyDownUp(event.type, event.keyCode);
    };

    let resize = function(event) {
	display.resize(document.documentElement.clientWidth - 32,
	    document.documentElement.clientHeight - 32, 
	    game.world.height / game.world.width);
	display.render();
    }

    // paint game on canvas
    let render = function() {
	display.fill(game.world.background_color, game.world.ground_polyg_x,
	    game.world.ground_polyg_y); // repaint background
	display.drawPlayer(game.world.player.x, game.world.player.y,
	    game.world.player.width, game.world.player.height,
	    game.world.player.color);
	display.render();
    };

    // update game logic
    let update = function() {
	if (controller.left.active) {
	    game.world.player.moveLeft();
	    controller.left.active = false;
	} else if (controller.right.active) {
	    game.world.player.moveRight();
	    controller.right.active = false;
	} else if (controller.up.active) {
	    game.world.player.jump();
	    controller.up.active = false;
	}
	game.update();
    };


    let canvas = document.getElementById("canvas-game-id");
    // handles user input
    let controller = new Controller();
    // handles on.screen canvas and window resize
    let display = new Display(canvas);
    // game logic
    let game = new Game(canvas.width, canvas.height);
    // engine lets MVC components interact
    let engine = new Engine(1000/30, render, update);

    // set display buffer to canvas size
    display.buffer.canvas.width = game.world.width;
    display.buffer.canvas.height = game.world.height;

    // add event handlers
    window.addEventListener("resize", resize);
    window.addEventListener("keydown", keyDownUp);
    window.addEventListener("keyup", keyDownUp);

    resize();
    engine.start(); // starts game loop

});
