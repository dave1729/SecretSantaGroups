function Participant(theX, theY, ctx1) {
	//alert("function Participant(theX, theY, ctx1)");
	//this.name = prompt("Please enter first person's name.", "Participant Num " + Math.floor(Math.random() * 1000));
	this.name = "Name-" + Math.floor(Math.random() * 1000);
	console.log("New Participant");
	this.ctx = ctx1;
	this.x = theX;
	this.y = theY;
	this.xFinal = undefined;
	this.yFinal = undefined;
	this.radius = 30;
	var num = Math.round(Math.random()*255);
	var num2 = Math.round(Math.random()*255);
	this.origionalColor = "rgb(" + num + ",180," + num2 + ")";
	this.group = null;
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
	this.checkForNewGroup(ssInterface);
}

Participant.prototype.checkForNewGroup = function(ssInterface) {
	var thisEntity = this;
	var thisHasNoGroup = true;
	var groupListLength = ssInterface.groupList.length;
	for(var i = groupListLength - 1; i >= 0; i--) {
		var currentGroup = ssInterface.groupList[i];
		var thisEntityDistToCenter = Math.sqrt(Math.pow(currentGroup.x - this.x, 2) + Math.pow(currentGroup.y - this.y, 2));
		if(currentGroup.outerRadius >= thisEntityDistToCenter) {
			thisEntity.color = currentGroup.color;
			thisEntity.group = currentGroup;
			currentGroup.groupParticipantList.push(thisEntity);
			thisHasNoGroup = false;
			break;
		}
	}
	if(thisHasNoGroup) {
		if(this.group !== null) {
			this.group.removeParticipant(thisEntity);
		}
		thisEntity.color = thisEntity.origionalColor;
		thisEntity.group = null;
	}
}

Participant.prototype.isTouchingMouse = function(point) {
	var distToCenter = Math.sqrt(Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2));
	return (this.radius >= distToCenter);
}

Participant.prototype.restoreColor = function() {
	if(this.group !== null) {
		this.color = this.group.color;
	}
	else {
		this.color = this.origionalColor;
	}
}

Participant.prototype.changeToGroup = function(group) {
		this.color = group.color;
		this.group = group;
}

Participant.prototype.update = function() {
	if (this.xFinal !== undefined && this.yFinal !== undefined) {
		var xDist = Math.abs(this.xFinal - this.x);
		var yDist = Math.abs(this.yFinal - this.y);
		
		var xDirection = -1;
		var yDirection = -1;
		
		if (this.xFinal - this.x > 0) xDirection = 1;
		if (this.yFinal - this.y > 0) yDirection = 1;
		
		if (Math.abs(this.xFinal - this.x) > 1) {
			this.x += xDirection * xDist * 0.005;
			console.log("X: " + this.x);
		}
		else {
			this.x = this.xFinal;
		}
		if (Math.abs(this.yFinal - this.y) > 1) {
			this.y += yDirection * yDist * 0.005;
		}
		else {
			this.y = this.yFinal;
		}
		
		if (this.xFinal === this.x && this.yFinal === this.y) {
			this.xFinal = undefined;
			this.yFinal = undefined;
		}
	}
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