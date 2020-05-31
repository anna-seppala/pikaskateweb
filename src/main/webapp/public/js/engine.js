/* fixed time-step game loop*/

"use strict"; // improved (stricter) javascript writing

const Engine = function(time_step, update, render) {
    this.accumulated_time = 0; // amount of time since last update
    this.animation_frame_request = undefined;
    this.time = undefined; // latest timestamp of loop execution
    this.time_step = time_step;

    this.updated = false; // whether update func called since last cycle
    this.update = update;
    this.render = render;

    this.loop = function(time_stamp) { // onle cycle of gameplay
	this.accumulated_time += time_stamp - this.time;
	this.time = time_stamp;

	// if playing on slow device, updates may take longer than time_step
	// stop potential memory spiral by only allowing set number of frames
	// to pass without update.
	if (this.accumulated_time >= this.time_step * 3) {
	    this.accumulated_time = this.time_step;
	}

	// we can only update when screen ready and requestAnimationFrame
	// calls loop(time_stamp) --> need to track time.
	// We want to update after accumulating one time_step's worth of time
	// if multiple time_steps accumulated -> update as often as needed
	while (this.accumulated_time >= this.time_step) {
	    this.accumulated_time -= this.time_step;
	    this.update(time_stamp);
	    this.updated = true; // if game updated, need to draw again
	}

	if (this.updated) {
	    this.updated = false;
	    this.render(time_stamp);
	}

	this.animation_frame_request =
	    window.requestAnimationFrame(this.handleLoop);

    };
    
    // with arrow func, 'this' points to Engine
    this.handleLoop = (time_step) => { this.loop(time_step); };

};

Engine.prototype = {
    constructor : Engine,
    start : function() {
	this.accumulated_time = this.time_step;
	this.time = window.performance.now();
	this.animation_frame_request =
	    window.requestAnimationFrame(this.handleLoop);
    },
    stop : function() {
	window.cancelAnimationFrame(this.animation_frame_request);
    }
};
