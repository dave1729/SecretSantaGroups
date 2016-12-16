var canvas = document.getElementById("InteractiveCanvas");

//set canvas dimensions
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 150;

//create context
var ctx = canvas.getContext('2d');

entityList = [];
entityList.push(new Background(canvas.width, canvas.height));
var createButton = new Button(.9*canvas.width, .9*canvas.height, .05*canvas.height);
entityList.push(createButton);
var im = new InputManager("Creating Participants", ctx);
im.addMouse();
im.start();
    
function Background(canvasWidth, canvasHeight) {
	this.color1 = "rgb(200,0,0)";
	this.color2 = "rgb(0,180,0)";
	this.width = canvasWidth;
	this.height = canvasHeight;
	this.boarderSize = 6;
}

Background.prototype.update = function() {
	//background needs no updating
}

Background.prototype.draw = function(context) {
	//draw background rectangles
	context.fillStyle = this.color1; // sets the color
	context.fillRect(0, 0, this.width, this.height);
	context.fillStyle = this.color2; // sets the color
	context.fillRect(this.boarderSize, this.boarderSize, this.width-2*this.boarderSize, this.height-2*this.boarderSize);
}

function Button(theX, theY, r) {
	this.x = theX;
	this.y = theY;
	this.radius = r;
	this.color = "rgb(200,0,0)";
}

Button.prototype.update = function() {
	//background needs no updating
}

Button.prototype.draw = function(context) {
	//draw background circle
	context.fillStyle = "rgb(200,0,0)"; // sets the color
	context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
	context.fill();
}

function Participant(theX, theY) {
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
	//background needs no updating
}

Participant.prototype.draw = function(ctx) {
	//draw background circle
	ctx.fillStyle = this.color; // sets the color
	ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
	ctx.fill();
}

var isTouching = function(point, circle) {
	var distToCenter = Math.sqrt(Math.pow(point.x - circle.x, 2) + Math.pow(point.y - circle.y, 2));
	return (circle.radius >= distToCenter);
}

var drawAll = function() {
	var mouse = im.getClick();
	console.log((mouse === undefined) + " ");
	if(!(mouse === undefined)) {
		if(isTouching(mouse, createButton)) {
			entityList.push(new Participant(mouse.x, mouse.y));
		}
	}
	for(var i = 0; i < entityList.length; i++) {
		var entity = entityList[i];
		entity.update();
		entity.draw(ctx);
	}
	window.requestAnimationFrame(drawAll);
}

window.requestAnimationFrame(drawAll);