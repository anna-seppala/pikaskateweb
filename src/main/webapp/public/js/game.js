/* Game logic of the pikachu skating game. */

const Game = function(width_in, height_in) {
    this.world = {
	background_color : "#005580",
	friction : 0.9,
	gravity : 3,
	width : width_in,
	height : height_in,
	player : new Game.Player(width_in, height_in),
	collideObject : function(object) {
	    // needed or not??
	},
	update : function() {
	    this.player.velocity_y += this.gravity;
	    this.player.update();

	    this.player.velocity_x *= this.friction;
	    this.player.velocity_y *= this.friction;
	    if (this.player.y >= this.height - this.player.height) {
		this.player.y = this.height - this.player.height;
		this.player.velocity_y = 0;
	    }
	    if (this.player.velocity_y <= 0) {
		this.player.jumping = false;
	    }

	    this.collideObject(this.player); // ??
	}
    };

    this.update = function() {
	this.world.update();
    };

};


Game.prototype = {
    constructor : Game
};

Game.Player = function(world_width, world_height) {
    this.width = 50;
    this.height = 60;
    this.velocity_x = 0;
    this.velocity_y = 0;
    this.x = world_width/2 - this.width/2;
    this.y = world_height - this.height;
    this.color = "#ff0000"; // temporary
    this.jumping = false;
};

Game.Player.prototype = {
    constructor : Game.Player,
    jump : function() {
	if (!this.jumping) {
	    this.jumping = true;
	    this.velocity_y -=20;
	}
    },
    moveLeft : function() {
	this.velocity_x -=0.5;
    },
    moveRight : function() {
	this.velocity_x +=0.5;
    },
    update : function() {
	//this.x += this.velocity_x;
	this.y += this.velocity_y;
    }
};

