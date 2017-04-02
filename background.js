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