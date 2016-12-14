function Participant(yourName, yourGroupNumber, yourSecretCode, yourSecretSanta) {
	this.name = yourName;
	this.groupNumber = yourGroupNumber;
	this.secretCode = yourSecretCode;
	this.secretSanta = yourSecretSanta;
}
var canvas = document.getElementById("InteractiveCanvas");
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 150;
var ctx = canvas.getContext('2d');
ctx.fillStyle = "rgb(200,0,0)"; // sets the color
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "rgb(0,180,0)"; // sets the color
var boarder = 6;
ctx.fillRect(boarder, boarder, canvas.width-2*boarder, canvas.height-2*boarder);
ctx.fillStyle = "rgb(200,0,0)"; // sets the color
ctx.arc(.9*canvas.width, .9*canvas.height, .05*canvas.height, 0, 2 * Math.PI, false);
ctx.fill();