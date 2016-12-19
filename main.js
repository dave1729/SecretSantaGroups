function SecretSantaInterface() {
	this.color1 = "rgb(132,9,17)";//red
	this.color2 = "rgb(49,92,43)";//green
	this.color3 = "rgb(20,40,23)";//darkGreen
	this.color4 = "rgb(83,62,45)";//brown
	this.color5 = "rgb(220,196,142)";//cream
	
	
	this.count = 0;
	//alert("function SecretSantaInterface()");
	this.canvas = document.getElementById("InteractiveCanvas");
	//set canvas dimensions
	this.canvas.width = window.innerWidth - 50;
	this.canvas.height = window.innerHeight - 150;
	
	//create context
	this.ctx = this.canvas.getContext('2d');
	this.entityList = [];
	this.background = new Background(this.canvas.width, this.canvas.height, this.color1, this.color2, this.ctx);
	this.createButton = new Button(.9*this.canvas.width, .9*this.canvas.height, .05*this.canvas.height, this.color1, this.color5, this.ctx);
	//this.entityList.push(this.background);
	this.entityList.push(this.createButton);
	this.im = new InputManager("Creating Participants", this.ctx);
	this.im.addMouse();
	this.im.start();
	this.mouseOverObject = undefined;
	this.drawAll();
}

SecretSantaInterface.prototype.isTouching = function(point, circle) {
	var distToCenter = Math.sqrt(Math.pow(point.x - circle.x, 2) + Math.pow(point.y - circle.y, 2));
	console.log("(DistToCenter,Radius) " + distToCenter + ", " + circle.radius);
	return (circle.radius >= distToCenter);
}

SecretSantaInterface.prototype.drawAll = function() {
	var self = this;
	var activeIndex = -1;
	var foundOne = false;
	//this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	self.background.draw();
	for(var i = 0; i < self.entityList.length; i++) {
		activeIndex++;
		var thisEntity = self.entityList[i];
		thisEntity.update();
		thisEntity.draw();
		if(self.im.mouseDown() && self.mouseOverObject === undefined) {
			if(self.isTouching(self.im.mouseLocation(), thisEntity)) {
				self.mouseOverObject = thisEntity;
				foundOne = true;
			}
		}
	}
	if(!(self.mouseOverObject === undefined) || foundOne) {
		self.mouseOverObject.beActive(self);
	}
	if(self.im.mouseUp()){
		self.mouseOverObject = undefined;
	}
	window.requestAnimationFrame(this.drawAll.bind(this));
}
    
function Background(canvasWidth, canvasHeight, color1, color2, ctx) {
	//alert("function Background(canvasWidth, canvasHeight, ctx)");
	this.ctx = ctx;
	this.color1 = color1;
	this.color2 = color2;
	this.width = canvasWidth;
	this.height = canvasHeight;
	this.boarderSize = 6;
}

Background.prototype.beActive = function(self) {
	//doesn't do anything when active
}

Background.prototype.update = function() {
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

function Button(theX, theY, r, color1, color2, ctx) {
	//alert("function Button(theX, theY, r, ctx)");
	this.ctx = ctx;
	this.x = theX;
	this.y = theY;
	this.radius = r;
	this.color1 = color1;
	this.color2 = color2;
}

Button.prototype.beActive = function(self) {
	self.mouseOverObject = new Participant(self.im.mouseLocation().x, self.im.mouseLocation().y, self.color3, self.ctx);
	self.entityList.push(self.mouseOverObject);
}

Button.prototype.update = function() {
	
}

Button.prototype.draw = function() {
	//alert("Button.prototype.draw");
	//draw background circle
	this.ctx.beginPath();
	this.ctx.fillStyle = this.color1;
	this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
	this.ctx.fill();
	this.ctx.closePath();
	this.ctx.beginPath();
	this.ctx.strokeStyle = this.color2;
	this.ctx.lineWidth = 2;
	this.ctx.moveTo(this.x - this.radius/2, this.y);
	this.ctx.lineTo(this.x + this.radius/2, this.y);
	this.ctx.stroke();
	this.ctx.closePath();
	this.ctx.beginPath();
	this.ctx.moveTo(this.x, this.y - this.radius/2);
	this.ctx.lineTo(this.x, this.y + this.radius/2);
	this.ctx.stroke();
}

function Participant(theX, theY, color, ctx1) {
	//alert("function Participant(theX, theY, ctx1)");
	this.ctx = ctx1;
	this.x = theX;
	this.y = theY;
	this.radius = 30;
	var num = Math.round(Math.random()*255);
	var num2 = Math.round(Math.random()*255);
	this.color = "rgb(" + num + ",255," + num2 + ")";
	//this.name = yourName;
	//this.groupNumber = yourGroupNumber;
	//this.secretCode = yourSecretCode;
	//this.secretSanta = yourSecretSanta;
}

Participant.prototype.beActive = function(self) {
	var mouseLoc = self.im.mouseLocation();
	this.x = mouseLoc.x;
	this.y = mouseLoc.y;
}

Participant.prototype.update = function() {

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