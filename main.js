function SecretSantaInterface() {
	//alert("function SecretSantaInterface()");
	this.canvas = document.getElementById("InteractiveCanvas");
	//set canvas dimensions
	this.canvas.width = window.innerWidth - 50;
	this.canvas.height = window.innerHeight - 150;
	
	//create context
	this.ctx = this.canvas.getContext('2d');
	this.entityList = [];
	this.background = new Background(this.canvas.width, this.canvas.height, this.ctx);
	this.createButton = new Button(.9*this.canvas.width, .9*this.canvas.height, .05*this.canvas.height, this.ctx);
	this.entityList.push(this.background);
	this.entityList.push(this.createButton);
	this.im = new InputManager("Creating Participants", this.ctx);
	this.im.addMouse();
	this.im.start();
	this.activeParticipant = undefined;
	this.drawAll();
}

SecretSantaInterface.prototype.isTouching = function(point, circle) {
	//alert("SecretSantaInterface.prototype.isTouching");
	var distToCenter = Math.sqrt(Math.pow(point.x - circle.x, 2) + Math.pow(point.y - circle.y, 2));
	return (circle.radius >= distToCenter);
}

SecretSantaInterface.prototype.drawAll = function() {
	if(this.im.mouseDown()) {
		if(isTouching(this.im.mouseLocation(), this.createButton)) {
			this.activeParticipant = new Participant(this.im.mouseLocation().x, this.im.mouseLocation().y, this.ctx);
			this.entityList.push(this.activeParticipant);
		}
	}
	else if(this.im.mouseUp()){
		this.activeParticipant = undefined;
	}
	//this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	for(var i = 0; i < this.entityList.length; i++) {
		var entity = this.entityList[i];
		entity.update();
		entity.draw();
	}
	window.requestAnimationFrame(this.drawAll);
}
    
function Background(canvasWidth, canvasHeight, ctx) {
	//alert("function Background(canvasWidth, canvasHeight, ctx)");
	this.ctx = ctx;
	this.color1 = "rgb(200,0,0)";
	this.color2 = "rgb(0,180,0)";
	this.width = canvasWidth;
	this.height = canvasHeight;
	this.boarderSize = 6;
}

Background.prototype.update = function() {
	//alert("Background.prototype.update");
	//background needs no updating
}

Background.prototype.draw = function() {
	//alert("Background.prototype.draw");
	//draw background rectangles
	this.ctx.beginPath();
	this.ctx.fillStyle = this.color1; // sets the color
	this.ctx.fillRect(0, 0, this.width, this.height);
	this.ctx.fillStyle = this.color2; // sets the color
	this.ctx.fillRect(this.boarderSize, this.boarderSize, this.width-2*this.boarderSize, this.height-2*this.boarderSize);
	this.ctx.closePath();
}

function Button(theX, theY, r, ctx) {
	//alert("function Button(theX, theY, r, ctx)");
	this.ctx = ctx;
	this.x = theX;
	this.y = theY;
	this.radius = r;
	this.color = "rgb(200,0,0)";
}

Button.prototype.update = function() {
	//alert("Button.prototype.update");
	//background needs no updating
}

Button.prototype.draw = function() {
	//alert("Button.prototype.draw");
	//draw background circle
	this.ctx.beginPath();
	this.ctx.fillStyle = "rgb(200,0,0)"; // sets the color
	this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
	this.ctx.fill();
	this.ctx.closePath();
}

function Participant(theX, theY, ctx1) {
	//alert("function Participant(theX, theY, ctx1)");
	this.ctx = ctx1;
	this.x = theX;
	this.y = theY;
	this.radius = 30;
	this.color = "rgb(0,0,200)";
	//this.name = yourName;
	//this.groupNumber = yourGroupNumber;
	//this.secretCode = yourSecretCode;
	//this.secretSanta = yourSecretSanta;
}

Participant.prototype.update = function() {
	//alert("Participant.prototype.update");
	if(active === this) {
		var mouseLoc = im.mouseLocation();
		this.x = mouseLoc.x;
		this.y = mouseLoc.y;
	}
}

Participant.prototype.draw = function() {
	//alert("Participant.prototype.draw");
	//draw background circle
	this.ctx.beginPath();
	this.ctx.fillStyle = this.color; // sets the color
	this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
	this.ctx.fill();
	this.ctx.closePath();
}

var ssInterface = new SecretSantaInterface();
ssInterface.drawAll();