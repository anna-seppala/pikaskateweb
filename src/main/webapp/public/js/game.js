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
	objects : null,
	max_objects : 10,
	max_obstacles : 6,
	total_obstacles : 0,
	obstacle_creation_delay : 6,
	obstacle_creation_counter : 0,
	collideObject : function(object) {
	    // needed or not??
	},
	init : function() {
	    this.objects = new Game.ObjectList();
	    this.objects.init(this.max_objects, this.player);
	    console.log("init world");
	},
	update : function() {
	    this.player.velocity_y += this.gravity;
	    this.player.update();

	    //this.player.velocity_x *= this.friction;
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
	    let angle = this.player.velocity_x/6*Math.PI/180;
	    let tan = Math.tan(angle);
	    this.ground_polyg_x[0] = 0;
	    this.ground_polyg_y[0] = Math.round(tan*this.width/2) + this.horizon_y;
	    this.ground_polyg_x[1] = this.width;
	    this.ground_polyg_y[1] = Math.round(-tan*this.width/2) + this.horizon_y;
	},
        updateObjects : function() {
	    let collision = false;
	    let angle = this.player.velocity_x/6*Math.PI/180; // vel to radians
	    let tan = Math.tan(angle);
	    this.obstacle_creation_counter++;
	    let obj = this.objects.getHead();
	    while (obj !== null) {
		if (obj.isActive()) {
		    obj.z -= this.player.velocity_z;

		    //TODO test collision here
		    
		    //if object moving out of sight -> remove
		    if(obj.z <= 0.45) {
			obj.deactivate();
			this.total_obstacles--;
			continue;
		    }

		    // transform object by palyer's x/z movement
		    for (let j=0; j<obj.x.length; j++) {
			for (let k=0; k<obj.x[j].length; k++) {
			    obj.x[j][k] -= this.player.velocity_x;
			}
		    }
		    // if player moving left/right -> objects transformed
		    obj.transform(angle, this.width/2, this.horizon_y);
		}
		obj = obj.next;
	    }
	    // if not enough obstacles in scene -> add new one
	    if (this.total_obstacles < this.max_obstacles &&
		this.obstacle_creation_counter > this.obstacle_creation_delay) {
		this.obstacle_creation_counter = 0;
		if (this.objects.activateObject(Math.round((Math.random()-0.5)*5000)
		    ,this.horizon_z)) {
		    this.total_obstacles++;
		}
	    }
	}
    };

    this.update = function() {
	this.world.update();
    };

    this.world.init();

};

Game.prototype = {
    constructor : Game
};


Game.Player = function(world_width, world_height) {
    this.max_velocity_x = 100;
    this.incr_velocity_x = 25;
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
	    this.velocity_y -=50;
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
    moveStraight : function() {
	if (this.velocity_x > 0) {
	    this.velocity_x -= this.incr_velocity_x/2;
	    if (this.velocity_x < 0 ) {
		this.velocity_x = 0;
	    }
	} else if (this.velocity_x < 0) {
	    this.velocity_x += this.incr_velocity_x/2;
	    if (this.velocity_x > 0) {
		this.velocity_x = 0;
	    }
	}
    },
    update : function() {
	//this.x += this.velocity_x;
	this.y += this.velocity_y;
    }
};


Game.ObjectList = function() {
    this.head = null;
    this.tail = null;
};

Game.ObjectList.prototype = {
    constructor : Game.ObjectList,
    init : function(total_objects, player) {
	let obj = null;
	for (let i=0; i<total_objects; i++) {
	    if (i%10 == 0) { // every 10th obj is heart
		obj = new Game.Obstacle();
		//obj = new Heart();
	    } else {
		obj = new Game.Obstacle();
	    }
	    if (i==0) {
		this.tail = obj;
	    }
	    obj.next = this.head;
	    if (this.head !== null) {
		this.head.prev = obj;
	    }
	    this.head = obj;
	}
    },
    getHead : function() {
	return this.head;
    },
    getTail : function() {
	return this.tail;
    },
    deactivateAll : function() {
	obj = this.head;
	while (obj !== null) {
	    obj.deactivate();
	    obj = obj.next;
	}
    },
    activateObject : function(x,z) {
	let obj = this.head;
	while (obj !== null) {
	    if (!obj.isActive()) {
		obj.init(x,z);
		if (obj != this.head) { //only move if not head
		    obj.prev.next = obj.next;
		    if (obj != this.tail) { // next is null if tail
			obj.next.prev = obj.prev;
		    } else { // if movin tail, update this.tail
			this.tail = obj.prev;
		    }
		    obj.next = this.head;
		    this.head.prev = obj;
		    this.head = obj;
		    this.head.prev = null;
		}
		return obj.isActive();
	    }
	    obj = obj.next;
	}
	return false;
    }
};



Game.FloatyObject = function(colors,x,y) {
    this.next = null;
    this.prev = null;
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
    let x = [ [-125,125,125,-125] ];
    let y = [ [-100,-100,350,350] ];
    Game.FloatyObject.call(this,colors, x,y);
}

Game.Obstacle.prototype = Object.create(Game.FloatyObject.prototype);
