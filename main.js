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
	
	//create context and empty entity list (everything is an entity except the background)
	this.ctx = this.canvas.getContext('2d');
	this.entityList = [];
	this.boarderSize = 10;
	
	//Create Background
	this.background = new Background(this.boarderSize, this.canvas.width, this.canvas.height, this.color1, this.color2, this.ctx);
	
	//Create the Button that creates new participants (in bottom right of screen)
	this.createButton = new Button("Create Participants Button", this.canvas.width - 60, this.canvas.height - 55, 30,
									this.color1, this.color5, this.ctx);
	this.createButton.beActive = function (ssInterface) {
		ssInterface.mouseOverObject = new Participant(ssInterface.im.mouseLocation().x, ssInterface.im.mouseLocation().y, ssInterface.ctx);
		ssInterface.entityList.push(ssInterface.mouseOverObject);
    };
	this.entityList.push(this.createButton);
	
	//Create the Button that puts participants in groups (in top right of screen)
	this.groupsButton = new Button("Create Groups Button", this.canvas.width - 60, 55, 30,
									this.color3, this.color5, this.ctx);
	this.groupsButton.beActive = function (ssInterface) {
		ssInterface.mouseOverObject = new Group(ssInterface.im.mouseLocation().x, ssInterface.im.mouseLocation().y, ssInterface.ctx);
		ssInterface.entityList.push(ssInterface.mouseOverObject);
    };
	this.entityList.push(this.groupsButton);
	this.im = new InputManager("Creating Participants", this.ctx);
	this.im.addMouse();
	this.im.start();
	this.mouseOverObject = undefined;
	this.drawAll();
}

SecretSantaInterface.prototype.isTouching = function(point, circle) {
	var distToCenter = Math.sqrt(Math.pow(point.x - circle.x, 2) + Math.pow(point.y - circle.y, 2));
	return (circle.radius >= distToCenter);
}

SecretSantaInterface.prototype.drawAll = function() {
	var self = this;
	var foundOne = 0;
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	
	//draw background before anything
	self.background.draw();
	
	//pick mouoseOverEntity, from top down
	for(var i = self.entityList.length-1; i >= 0; i--) {
		var thisEntity = self.entityList[i];
		//to become new mouseEntity mouse must be down, over the entity, and a previous entity must not have been chosen
		if(self.im.mouseDown() && self.isTouching(self.im.mouseLocation(), thisEntity) && self.mouseOverObject === undefined) {
			self.entityList.splice(i, 1);
			self.entityList.push(thisEntity);
			self.mouseOverObject = thisEntity;
			foundOne++;
			break;
		}
	}
	
	//have it do whatever its mouseOverEntity things are
	console.log("Found One: " + foundOne);
	if(!(self.mouseOverObject === undefined) || foundOne > 0) {
		self.mouseOverObject.beActive(self);
	}
	
	//if mouse is up, there is no entity
	if(self.im.mouseUp()){
		self.mouseOverObject = undefined;
	}
	
	//draw all entities, from bottom up, and let them self update if they need to
	for(var i = 0; i < self.entityList.length; i++) {
		var thisEntity = self.entityList[i];
		thisEntity.update();
		thisEntity.draw();
	}
	
	//request next frame, with callback to this function
	window.requestAnimationFrame(this.drawAll.bind(this));
}
    
function Background(boarderSize, canvasWidth, canvasHeight, color1, color2, ctx) {
	//alert("function Background(canvasWidth, canvasHeight, ctx)");
	this.name = "Background";
	this.ctx = ctx;
	this.color1 = color1;
	this.color2 = color2;
	this.width = canvasWidth;
	this.height = canvasHeight;
	this.boarderSize = boarderSize;
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

function Button(theName, theX, theY, radius, color1, color2, ctx) {
	//alert("function Button(theX, theY, r, ctx)");
	this.name = theName;
	this.ctx = ctx;
	this.radius = radius;
	this.x = theX;
	this.y = theY;
	this.color1 = color1;
	this.color2 = color2;
}

//Button.prototype.beActive = function(ssInterface) {
	//BUTTONS BEACTIVE FUNCTION IS DEFINED ON CREATION, TO BE DIFFERENT EVERY TIME
//}

Button.prototype.update = function() {
	
}

Button.prototype.draw = function() {
	//alert("Button.prototype.draw");
	//draw background circle
	this.ctx.beginPath();
	this.ctx.fillStyle = this.color1;
	this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
	this.ctx.fill();
	this.ctx.lineWidth = 2;
	this.ctx.strokeStyle = this.color2;
	this.ctx.moveTo(this.x - this.radius/3, this.y);
	this.ctx.lineTo(this.x + this.radius/3, this.y);
	this.ctx.moveTo(this.x, this.y - this.radius/3);
	this.ctx.lineTo(this.x, this.y + this.radius/3);
	this.ctx.stroke();
	this.ctx.closePath();
}

function Participant(theX, theY, ctx1) {
	//alert("function Participant(theX, theY, ctx1)");
	this.name = "Participant Num " + Math.floor(Math.random() * 1000);
	this.ctx = ctx1;
	this.x = theX;
	this.y = theY;
	this.radius = 30;
	var num = Math.round(Math.random()*255);
	var num2 = Math.round(Math.random()*255);
	this.color = "rgb(" + num + ",180," + num2 + ")";
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
	this.ctx.strokeStyle = "rgb(35,35,35)";
	this.ctx.lineWidth = 2;
	this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
	this.ctx.fill();
	this.ctx.stroke();
	this.ctx.closePath();
}

/////////////////////////////////////
function Group(theX, theY, ctx1) {
	//alert("function Participant(theX, theY, ctx1)");
	this.name = "Group Num " + Math.floor(Math.random() * 100);
	this.ctx = ctx1;
	this.x = theX;
	this.y = theY;
	this.radius = 100;
	var num = Math.round(Math.random()*255);
	var num2 = Math.round(Math.random()*255);
	this.color = "rgb(" + num + ",200," + num2 + ")";
	//this.name = yourName;
	//this.groupNumber = yourGroupNumber;
	//this.secretCode = yourSecretCode;
	//this.secretSanta = yourSecretSanta;
}

Group.prototype.beActive = function(self) {
	var mouseLoc = self.im.mouseLocation();
	this.x = mouseLoc.x;
	this.y = mouseLoc.y;
}

Group.prototype.update = function() {

}

Group.prototype.draw = function() {
	//alert("Participant.prototype.draw");
	//draw background circle
	this.ctx.beginPath();
	this.ctx.strokeStyle = this.color;
	this.ctx.lineWidth = 10;
	this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
	this.ctx.stroke();
	this.ctx.closePath();
}

var ssInterface = new SecretSantaInterface();
ssInterface.drawAll();