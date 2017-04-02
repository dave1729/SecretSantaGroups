function Group(theX, theY, ctx1) {
	//this.name = prompt("Please enter group name.", "Group Num " + Math.floor(Math.random() * 100));
	this.name = "Name";
	this.ctx = ctx1;
	this.x = theX;
	this.y = theY;
	this.activePart = "none";//determines weather the inner radius is affected, or outer radius
	this.outerRadius = 100;
	this.innerRadius = 15;
	var num = Math.round(Math.random()*200) + 25;
	this.color = "rgb(" + num + ",0,0)";
	this.lineWidth = 10;
	//this.name = yourName;
	//this.groupNumber = yourGroupNumber;
	//this.secretCode = yourSecretCode;
	//this.secretSanta = yourSecretSanta;
}

Group.prototype.beActive = function(ssInterface) {
	var mouseLoc = ssInterface.im.mouseLocation();
	if(this.activePart === "innerRadius") {
		// update group location
		this.x = mouseLoc.x;
		this.y = mouseLoc.y;
	}
	else if(this.activePart === "outerRadius"){
		// update group radius
		var distToCenter = Math.sqrt(Math.pow(mouseLoc.x - this.x, 2) + Math.pow(mouseLoc.y - this.y, 2));
		this.outerRadius = distToCenter;
	}
	else if(this.activePart === "none") {
		var point = ssInterface.im.mouseLocation();
		var distToCenter = Math.sqrt(Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2));
		var delta = Math.abs(this.outerRadius - distToCenter);
		//if we're already selecting the outer, Stay on outer. Otherwise we can check to see if we are touching enough
		if(delta <= this.lineWidth/2) {
			this.activePart = "outerRadius";
		}
		// check to see if we are close enough
		else if(this.innerRadius >= distToCenter) {
			this.activePart = "innerRadius";
		}
	}
}

Group.prototype.stopBeingActive = function(ssInterface) {
	var thisGroup = this;
	this.activePart = "none";
	for(var i = 0; i < ssInterface.participantList.length; i++) {
		var thisEntity = ssInterface.participantList[i];
		var distToCenter = Math.sqrt(Math.pow(thisEntity.x - thisGroup.x, 2) + Math.pow(thisEntity.y - thisGroup.y, 2));
		if(thisGroup.outerRadius >= distToCenter) {
			thisEntity.changeColorTo(thisGroup.color);
		}
		else if(thisEntity.color === thisGroup.color) {
			thisEntity.stopBeingActive(ssInterface);
		}
	}
}

Group.prototype.isTouchingMouse = function(point) {
	var isTouching = false;
	var distToCenter = Math.sqrt(Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2));
	var delta = Math.abs(this.outerRadius - distToCenter);
	//if we're already selecting the inner, Stay on inner. Otherwise we can check to see if we are close enough
	if(this.innerRadius >= distToCenter || delta <= this.lineWidth/2) {
		//this.activePart = "innerRadius";
		isTouching = true;
	}
	
	return isTouching;
}

Group.prototype.update = function() {

}

Group.prototype.draw = function() {
	//alert("Participant.prototype.draw");
	//draw background circle
	this.ctx.beginPath();
	this.ctx.fillStyle = this.color;
	this.ctx.arc(this.x, this.y, this.innerRadius, 0, 2 * Math.PI, false);
	this.ctx.fill();
	this.ctx.closePath();
	this.ctx.beginPath();
	this.ctx.strokeStyle = this.color;
	this.ctx.lineWidth = this.lineWidth;
	this.ctx.arc(this.x, this.y, this.outerRadius, 0, 2 * Math.PI, false);
	this.ctx.stroke();
	this.ctx.fillStyle = "rgb(35,35,35)";
	this.ctx.font="10px Georgia";
	this.ctx.fillText(this.name,this.x - this.innerRadius, this.y + this.innerRadius + 10);
	this.ctx.closePath();
}