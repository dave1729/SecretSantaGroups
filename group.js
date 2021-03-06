function Group(theX, theY, ctx1) {
	//this.name = prompt("Please enter group name.", "Group Num " + Math.floor(Math.random() * 100));
	this.name = "Group-" + Math.floor(Math.random() * 100);
	console.log("New Group: " + this.name);
	this.ctx = ctx1;
	this.x = theX;
	this.y = theY;
	this.activePart = "none";//determines weather the inner radius is affected, or outer radius
	this.outerRadius = 100;
	this.innerRadius = 15;
	this.groupParticipantList = [];
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
	
	// check for participants who need to be in this group now
	for(var i = 0; i < ssInterface.participantList.length; i++) {
		var currentParticipant = ssInterface.participantList[i];
		var distToCenter = Math.sqrt(Math.pow(currentParticipant.x - thisGroup.x, 2) + Math.pow(currentParticipant.y - thisGroup.y, 2));
		if(thisGroup.outerRadius >= distToCenter) {
			this.groupParticipantList.push(currentParticipant);
			currentParticipant.changeToGroup(thisGroup);
		}
		else if(currentParticipant.group === thisGroup) {
			this.groupParticipantList.splice(i, 1);
			currentParticipant.checkForNewGroup(ssInterface);
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

Group.prototype.removeParticipant = function(participant) {
	var self = this;
	var groupParticipantListLength = self.groupParticipantList.length;
	for(var i = 0; i < groupParticipantListLength; i++) {
		var thisEntity = self.groupParticipantList[i];
			if(thisEntity === participant) {
				self.groupParticipantList.splice(i, 1);
				break;
			}
	}
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