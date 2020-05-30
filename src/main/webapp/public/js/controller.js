/* Controller combines MVC components */

const Controller = function() {
    this.down = new Controller.ButtonInput();
    this.up = new Controller.ButtonInput();
    this.left = new Controller.ButtonInput();
    this.right = new Controller.ButtonInput();

    this.keyDownUp = function (event_type, key_code) {
	let down = (event_type == "keydown") ? true : false;
	switch(key_code) {
	    case 37:
		this.left.getInput(down);
		break;
	    case 32: // space bar
		this.up.getInput(down);
		break;
	    case 39:
		this.right.getInput(down);
		break;
	    case 40:
		this.down.getInput(down);
		break;
	}
    };
};

Controller.prototype = {
    constructor : Controller
};

Controller.ButtonInput = function() {
    this.active = false;
    this.down = false;
};

Controller.ButtonInput.prototype = {
    constructor : Controller.ButtonInput,
    getInput : function(down) {
	if (this.down != down) {
	    this.active = down;
	}
    }
};
