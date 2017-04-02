function Participant(theX, theY, ctx1) {
	//alert("function Participant(theX, theY, ctx1)");
	//this.name = prompt("Please enter first person's name.", "Participant Num " + Math.floor(Math.random() * 1000));
	this.name = "Name";
	this.ctx = ctx1;
	this.x = theX;
	this.y = theY;
	this.radius = 30;
	var num = Math.round(Math.random()*255);
	var num2 = Math.round(Math.random()*255);
	this.origionalColor = "rgb(" + num + ",180," + num2 + ")";
	this.groupColor = null;
	this.color = this.origionalColor;
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

Participant.prototype.stopBeingActive = function(ssInterface) {
	var thisEntity = this;
	var thisHasNoGroup = true;
	for(var i = 0; i < ssInterface.groupList.length; i++) {
		var thisGroup = ssInterface.groupList[i];
		var distToCenter = Math.sqrt(Math.pow(thisGroup.x - this.x, 2) + Math.pow(thisGroup.y - this.y, 2));
		if(thisGroup.outerRadius >= distToCenter) {
			thisEntity.color = thisGroup.color;
			thisEntity.groupColor = thisEntity.color;
			thisHasNoGroup = false;
		}
	}
	if(thisHasNoGroup) {
		thisEntity.color = thisEntity.origionalColor;
	}
}

Participant.prototype.isTouchingMouse = function(point) {
	var distToCenter = Math.sqrt(Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2));
	return (this.radius >= distToCenter);
}

Participant.prototype.restoreColor = function() {
	if(this.groupColor !== null) {
		this.color = this.groupColor;
	}
	else {
		this.color = this.origionalColor;
	}
}

Participant.prototype.changeColorTo = function(newColor) {
		this.color = newColor;
		this.groupColor = newColor;
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
	this.ctx.fillStyle = "rgb(35,35,35)";
	this.ctx.font="10px Georgia";
	this.ctx.fillText(this.name,this.x - this.radius, this.y + this.radius + 10);
	this.ctx.closePath();
}