/* Game logic of the pikachu skating game. */
"use strict"; // improved (stricter) javascript writing

const Game = function(width_in, height_in) {
    this.world = {
	background_color : "#005580",
	friction : 0.9,
	gravity : 3,
	horizon_z : 26, // z distance from horizon
	horizon_y : height_in/2 + 14, // a bit lower than centre
	ground_polyg_y : [height_in/2+14, height_in/2+14, height_in,height_in],
	ground_polyg_x : [0, width_in, width_in, 0],
	max_tilt : Math.PI/6, // 30 deg
	width : width_in,
	height : height_in,
	player : new Game.Player(width_in, height_in),
	objects : [ new Game.Obstacle(), new Game.Obstacle(),
	    new Game.Obstacle(), new Game.Obstacle(),
	    new Game.Obstacle(), new Game.Obstacle() ],
	max_obstacles : 6,
	total_obstacles : 0,
	obstacle_creation_delay : 6,
	obstacle_creation_counter : 0,
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
	    // jumping stops when player sinks to orig pos
	    if (this.player.y >= this.height - this.player.height &&
		this.player.velocity_y >= 0) {
		this.player.jumping = false;
	    }

	    this.updateObjects();
	    this.collideObject(this.player); // ??
	    // if player moving left/right, tilt horizon:
	    let angle = this.player.velocity_x*Math.PI/180;
	    let tan = Math.tan(angle);
	    this.ground_polyg_x[0] = 0;
	    this.ground_polyg_y[0] = Math.round(tan*this.width/2) + this.horizon_y;
	    this.ground_polyg_x[1] = this.width;
	    this.ground_polyg_y[1] = Math.round(-tan*this.width/2) + this.horizon_y;
	},
        updateObjects : function() {
	    let collision = false;
	    let angle = this.player.velocity_x*Math.PI/180; // vel to radians
	    let tan = Math.tan(angle);
	    this.obstacle_creation_counter++;
	    for (let i=0; i<this.objects.length; i++) {
		if (this.objects[i].isActive()) {
		    this.objects[i].z -= this.player.velocity_z;

		    //TODO test collision here
		    
		    //if object moving out of sight -> remove
		    if(this.objects[i].z <= 0.45) {
			this.objects[i].deactivate();
			this.total_obstacles--;
			continue;
		    }

		    // transform object by palyer's x/z movement
		    for (let j=0; j<this.objects[i].x.length; j++) {
			for (let k=0; k<this.objects[i].x[j].length; k++) {
			    this.objects[i].x[j][k] -= this.player.velocity_x;
			}
		    }
		    // if player moving left/right -> objects transformed
		    this.objects[i].transform(angle, this.width/2, this.horizon_y);
		}

	    }
	    // if not enough obstacles in scene -> add new one
	    if (this.total_obstacles < this.max_obstacles &&
		this.obstacle_creation_counter > this.obstacle_creation_delay) {
		this.obstacle_creation_counter = 0;
		for (let i=0; i<this.objects.length; i++) {
		    if (!this.objects[i].isActive()) {
			this.objects[i].init(Math.round((Math.random()-0.5)*5000),this.horizon_z);
			this.total_obstacles++;
			break;
		    }
		}
	    }
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
    this.max_velocity_x = 30;
    this.incr_velocity_x = 5;
    this.width = 50;
    this.height = 60;
    this.velocity_x = 0;
    this.velocity_y = 0;
    this.velocity_z = 1; // constant forwards velocity
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

Game.FloatyObject = function(colors,x,y) {
    this.collided = false;
    this.active = false;
    this.colors = colors;
    this.poly_x = Array(x.length).fill(undefined); // orig polygon shape, x&y
    this.poly_y = Array(y.length).fill(undefined);
    this.x = x; // transformed x & y
    this.y = y;
    this.x_scaled = Array(x.length).fill(undefined); // scaled&transformed x&y
    this.y_scaled = Array(y.length).fill(undefined);
    //ugly hack for non-ref copy of x and y
    for (let i=0; i<x.length; i++) {
	this.poly_x[i] = Array(x[i].length).fill(0);
	this.poly_y[i] = Array(y[i].length).fill(0);
	this.x_scaled[i] = Array(x[i].length).fill(0);
	this.y_scaled[i] = Array(y[i].length).fill(0);
	for (let j=0; j<x[i].length; j++) {
	    this.poly_x[i][j] = x[i][j]; 
	    this.poly_y[i][j] = y[i][j];
	    this.x_scaled[i][j] = x[i][j]; 
	    this.y_scaled[i][j] = y[i][j];
	}
    }
    this.z = 0;
};

Game.FloatyObject.prototype = {
    constructor : Game.FloatyObject,
    transform : function(angle, pivot_x, pivot_y) {
	let sine = Math.sin(angle);
	let cosine = Math.cos(angle);
	let scale = 1/(1+this.z);
	for (let i=0; i<this.x.length; i++) {
	    for (let j=0; j<this.x[i].length; j++) {
		let d1 = cosine * this.x[i][j] + sine * this.y[i][j];
		let d2 = -sine * this.x[i][j] + cosine * this.y[i][j];
		this.x_scaled[i][j] = Math.round(d1 * scale) + pivot_x;
		this.y_scaled[i][j] = Math.round(d2 * scale) + pivot_y;
	    }
	}
    },
    init : function(x_in_world, z) { // initialise with obstacle's abs pos
	for (let i=0; i< this.x.length; i++) {
	    for (let j=0; j<this.x[i].length; j++) {
		this.x[i][j] = this.poly_x[i][j] + x_in_world;
	    }
    	}
	this.z = z;
	this.active = true;
	this.collided = false;
    },
    isActive : function() {
	return this.active;
    },
    isCollision : function() {
	return false; //TODO: cretae this func
    },
    deactivate : function() {
	this.active = false;
    }
}

Game.Obstacle = function() { 
    let colors = ["rgb(71,214,158)", "rgb(9,128,86)", "rgb(8,76,9)"];
    let x = [ [-50,50,50,-50] ];
    let y = [ [-50,-50,150,150] ];
    Game.FloatyObject.call(this,colors, x,y);
}

Game.Obstacle.prototype = Object.create(Game.FloatyObject.prototype);
