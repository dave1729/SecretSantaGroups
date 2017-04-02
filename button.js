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

Button.prototype.stopBeingActive = function(ssInterface) {
	//Unused
}

//Button.prototype.beActive = function(ssInterface) {
	//BUTTONS BEACTIVE FUNCTION IS DEFINED ON CREATION, TO BE DIFFERENT EVERY TIME
//}

Button.prototype.isTouchingMouse = function(point) {
	var distToCenter = Math.sqrt(Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2));
	return (this.radius >= distToCenter);
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
	this.ctx.lineWidth = 2;
	this.ctx.strokeStyle = this.color2;
	this.ctx.moveTo(this.x - this.radius/3, this.y);
	this.ctx.lineTo(this.x + this.radius/3, this.y);
	this.ctx.moveTo(this.x, this.y - this.radius/3);
	this.ctx.lineTo(this.x, this.y + this.radius/3);
	this.ctx.stroke();
	this.ctx.closePath();
}