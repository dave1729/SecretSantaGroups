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
	this.participantList = [];
	this.groupList = [];
	this.buttonList = [];
	this.boarderSize = 10;
	this.mouseOverObject = null;
	
	//Create Background
	this.background = new Background(this.boarderSize, this.canvas.width, this.canvas.height, this.color1, this.color2, this.ctx);
	
	//Create the Button that creates new participants (in bottom right of screen)
	this.createButton = new Button("Create Participants Button", this.canvas.width - 60, this.canvas.height - 55, 30,
									this.color1, this.color5, this.ctx);
	this.createButton.beActive = function (ssInterface) {
		ssInterface.mouseOverObject = new Participant(ssInterface.im.mouseLocation().x, ssInterface.im.mouseLocation().y, ssInterface.ctx);
		ssInterface.entityList.push(ssInterface.mouseOverObject);
		ssInterface.participantList.push(ssInterface.mouseOverObject);
    };
	this.entityList.push(this.createButton);
	this.buttonList.push(this.createButton);
	
	//Create the Button that puts participants in groups (in top right of screen)
	this.groupsButton = new Button("Create Groups Button", this.canvas.width - 60, 55, 30,
									this.color3, this.color5, this.ctx);
	this.groupsButton.beActive = function (ssInterface) {
		ssInterface.mouseOverObject = new Group(ssInterface.im.mouseLocation().x, ssInterface.im.mouseLocation().y, ssInterface.ctx);
		ssInterface.entityList.push(ssInterface.mouseOverObject);
		ssInterface.groupList.push(ssInterface.mouseOverObject);
		ssInterface.mouseOverObject.activePart = "innerRadius";
		ssInterface.mouseOverObject.beActive(ssInterface);
    };
	this.entityList.push(this.groupsButton);
	this.buttonList.push(this.groupsButton);
	
	//Create and Start the Input Manager
	this.im = new InputManager("Creating Participants", this.ctx);
	this.im.addMouse();
	this.im.start();
	
	//Start
	this.drawAll();
}

SecretSantaInterface.prototype.drawAll = function() {
	var self = this;
	// this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	var j = 0;
	console.log("J reset to 0.");
	//draw background before anything
	self.background.draw();

	//pick mouoseOverEntity, from top down
	for(var i = self.entityList.length-1; i >= 0; i--) {
		var thisEntity = self.entityList[i];
		//to become new mouseEntity mouse must be down, over the entity, and a previous entity must not have been chosen
		if(self.mouseOverObject === null && self.im.mouseDown() && thisEntity.isTouchingMouse(self.im.mouseLocation())) {
			self.entityList.splice(i, 1);
			self.entityList.push(thisEntity);
			self.mouseOverObject = thisEntity;
			j = i;
			console.log(j);
			broken = true;
			break;
		}
	}
	//have it do whatever its mouseOverEntity things are
	if(!(self.mouseOverObject === null)) {
		self.mouseOverObject.beActive(self);
	}
	
	//if mouse is up, there is no entity
	if(self.im.mouseUp() && self.mouseOverObject !== null){
		self.mouseOverObject.stopBeingActive(self);
		self.mouseOverObject = null;
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

var ssInterface = new SecretSantaInterface();
ssInterface.drawAll();