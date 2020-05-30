/* Display handles drawing to buffer and displaying on screen */

const Display = function(canvas) {
    this.buffer = document.createElement("canvas").getContext("2d");
    this.context = canvas.getContext("2d");

    this.drawPlayer = function(x,y, width,height, color) {
	this.buffer.fillStyle = color;
	this.buffer.fillRect(Math.round(x), Math.round(y), width, height);
    };

    this.fill = function(color) {
	this.buffer.fillStyle = color;
	this.buffer.fillRect(0,0, this.buffer.canvas.width, this.buffer.canvas.height);
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
