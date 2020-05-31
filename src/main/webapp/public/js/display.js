/* Display handles drawing to buffer and displaying on screen */

"use strict"; // improved (stricter) javascript writing

const Display = function(canvas) {
    this.buffer = document.createElement("canvas").getContext("2d");
    this.context = canvas.getContext("2d");

    this.drawPlayer = function(x,y, width,height, color) {
	this.buffer.fillStyle = color;
	this.buffer.fillRect(Math.round(x), Math.round(y), width, height);
    };

    this.drawObject = function(x,y, colors) {
	for (let i=0; i<x.length; i++) {
	    this.buffer.fillStyle = colors[i];
	    this.buffer.beginPath();
	    this.buffer.moveTo(x[i][0], y[i][0]);
	    for (let j=1; j<x[i].length; j++) {
		this.buffer.lineTo(x[i][j],y[i][j]);
	    }
	    this.buffer.closePath();
	    this.buffer.fill();
	}
    }

    this.fill = function(color, ground_polyg_x, ground_polyg_y) {
	this.buffer.fillStyle = color;
	this.buffer.fillRect(0,0, this.buffer.canvas.width, this.buffer.canvas.height);
	this.buffer.fillStyle = "#e6bbc4";
	this.buffer.beginPath();
	this.buffer.moveTo(ground_polyg_x[0], ground_polyg_y[0]);
	this.buffer.lineTo(ground_polyg_x[1], ground_polyg_y[1]);
	this.buffer.lineTo(ground_polyg_x[2], ground_polyg_y[2]);
	this.buffer.lineTo(ground_polyg_x[3], ground_polyg_y[3]);
	this.buffer.closePath();
	this.buffer.fill();
    };

    this.render = function() {
	this.context.drawImage(this.buffer.canvas, 0,0,
	    this.buffer.canvas.width, this.buffer.canvas.height,
	0,0, this.context.canvas.width, this.context.canvas.height);
    };
    
    this.resize = function(event) {
	
    };

};

Display.prototype = {
    constructor : Display

};
