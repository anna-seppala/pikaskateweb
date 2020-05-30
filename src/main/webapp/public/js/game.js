/* Game logic of the pikachu skating game. */

const Game = function(width_in, height_in) {
    this.world = {
	background_color : "#005580",
	friction : 0.9,
	gravity : 3,
	horizon_y : height_in/2 + 14, // a bit lower than centre
	ground_polyg_y : [height_in/2+14, height_in/2+14, height_in,height_in],
	ground_polyg_x : [0, width_in, width_in, 0],
	max_tilt : Math.PI/6, // 30 deg
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
	    let angle = this.max_tilt * this.player.velocity_x;
	    let tan = Math.tan(angle);
	    this.ground_polyg_x[0] = 0;
	    this.ground_polyg_y[0] = Math.round(tan*this.width/2) + this.horizon_y;
	    this.ground_polyg_x[1] = this.width;
	    this.ground_polyg_y[1] = Math.round(-tan*this.width/2) + this.horizon_y;
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
    this.max_velocity_x = 0.6;
    this.incr_velocity_x = 0.11;
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
	this.velocity_x -=this.incr_velocity_x;
	if (this.velocity_x <= -this.max_velocity_x) {
	    this.velocity_x = -this.max_velocity_x;
	}
    },
    moveRight : function() {
	this.velocity_x += this.incr_velocity_x;
	if (this.velocity_x >= this.max_velocity_x) {
	    this.velocity_x = this.max_velocity_x;
	}
    },
    update : function() {
	//this.x += this.velocity_x;
	this.y += this.velocity_y;
    }
};

