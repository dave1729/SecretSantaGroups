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
	
	//Create the Button that creates new participants (in bottom right of screen)
	this.sortButton = new Button("Create Sort Button", 60, 55, 30,
									this.color4, this.color5, this.ctx);
	this.sortButton.beActive = function (ssInterface) {
		
		if(Date.now() - this.lastPressTime > 2000) {
			console.log('sort button pressed');
			ssInterface.sortParticipants(ssInterface);
			console.log('participants sorted');
			ssInterface.mouseOverObject = null;
			console.log('no mouseoverobject');
			this.lastPressTime = Date.now();
		}
    };
	this.entityList.push(this.sortButton);
	this.buttonList.push(this.sortButton);
	
	//Create and Start the Input Manager
	this.im = new InputManager("Creating Participants", this.ctx);
	this.im.addMouse();
	this.im.start();
	
	//Start
	this.drawAll();
}

SecretSantaInterface.prototype.drawAll = function() {
	var self = this;

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
	
	//draw all entities, from bottom up, and let them update if they need to
	for(var i = 0; i < self.entityList.length; i++) {
		var thisEntity = self.entityList[i];
		thisEntity.update();
		thisEntity.draw();
	}
	
	//request next frame, with callback to this function
	window.requestAnimationFrame(this.drawAll.bind(this));
}

SecretSantaInterface.prototype.sortParticipants = function(ssInterface) {
	var groupList = ssInterface.groupList;
	console.log("\nssInterface.groupList.length: " + groupList.length);
	
	var participantCount = ssInterface.participantList.length;
	
	if(ssInterface.groupList !== null && groupList.length > 0){
		// sort by largest to smallest
		console.log("Sorting Groups");
		ssInterface.groupList.sort(
		          function(group1, group2){
		             return group2.groupParticipantList.length - group1.groupParticipantList.length;
		          }
		);
		
		// make bucket list
		var participantBucketCount = groupList.length;
		var bucketList = [];
		var largestGroup = groupList[0];
		console.log("Largest Group: " + largestGroup.name);
		var numberOfBuckets = largestGroup.groupParticipantList.length;
		
		for(var i = 0; i < numberOfBuckets; i++) {
			bucketList.push(new Bucket(i));
		}
		
		shuffle(largestGroup.groupParticipantList);
		
		for(var i = 0; i < numberOfBuckets; i++) {
			bucketList[i].addParticipant(largestGroup.groupParticipantList[i]);
		}
		
		console.log("Participants Length: " + this.participantList.length);
		for(var i = 0; i < this.participantList.length; i++) {
			var currentParticipant = this.participantList[i];
			if(currentParticipant.group === largestGroup) {
				this.participantList.splice(i, 1);
				i--;
			}
		}
		console.log("Participants Length: " + this.participantList.length);
		
		var iterationCount = 0;
		var everyoneIsAssigned = false;
		
		shuffle(this.participantList);
		
		while(this.participantList.length > 0 && iterationCount < 100) {
			
			iterationCount++;
			
			var numberofParticipants = this.participantList.length;
			var currentParticipantIdx = Math.floor(Math.random() * numberofParticipants);
			var currentParticipant = this.participantList[currentParticipantIdx];
			var currentBucketIdx = Math.floor(Math.random() * numberOfBuckets);
			var currentBucket = bucketList[currentBucketIdx];
			
			var groupName = "[no group]";
			if(currentParticipant.group !== null && currentParticipant.group.name !== null) groupName = currentParticipant.group.name;
			
			console.log("Trying to put " + currentParticipant.name + " of group " + groupName + " in bucket " + currentBucket.number + ".");
			
			if(currentBucket.addParticipant(currentParticipant)) {
				this.participantList.splice(currentParticipantIdx, 1);
			}
			else if (currentParticipant.group === largestGroup) {
				this.participantList.splice(currentParticipantIdx, 1);
			}
			
			console.log("Participants Length: " + this.participantList.length);
			if(iterationCount % 100 === 0) console.log("Iterations: " + iterationCount);
		}
		console.log("Iterations: " + iterationCount);
	}
	
	if(ssInterface.participantList !== null && ssInterface.participantList.length > 0) {
		console.log("all participants count: " + ssInterface.participantList.length);
	}
	
	console.log("PRINTING PARTICIPANTS");
	
	var secretSantaList = [];
	
	for(var i = 0; i < bucketList.length; i++) {
		var bucket = bucketList[i];
		console.log("Bucket: " + bucket.number);
	     for(var j = 0; j < bucket.participantsInBucket.length; j++) {
	    	 var participant = bucket.participantsInBucket[j];
	    	 participant.origionalColor = participant.color;
	    	 secretSantaList.push(participant);
	    	 console.log("    Participant: ");
	    	 console.log("        " + participant.name + " buys for...");
	     }
	}
	
	console.log("Largest group Type: " + typeof(largestGroup));
	
	setFinalCircleLocations(secretSantaList);
}

function shuffle(list) {
	// random index, scanning value, i
    var randIdx, scanValue, i;
    for (i = list.length-1; i > 0 ; i--) {
    	// find some random index
        randIdx = Math.floor(Math.random() * i);
        //grab current values, scanning from the end
        scanValue = list[i];
        // switch the random value with the current value
        list[i] = list[randIdx];
        list[randIdx] = scanValue;
    }
}

function setFinalCircleLocations(list) {
	if (list === null || list.length < 1) {
		return false;
	}
	
	var bigArcLength = list[0].radius * 2.0;
	var bigCircumference = list.length * bigArcLength;
	var bigRadius = bigCircumference / (Math.PI * 2.0);
	var deltaTheta = (bigArcLength / bigCircumference) * 2.0 * Math.PI;
	var theta = 0;
	
    for (var i = 0; i < list.length; i++) {
    	var participant = list[i];
    	participant.xFinal = Math.cos(theta) * bigRadius + bigRadius + bigArcLength;
    	participant.yFinal = Math.sin(theta) * bigRadius + bigRadius + bigArcLength;
    	theta += deltaTheta;
    }
    
    return true;
}

var ssInterface = new SecretSantaInterface();
ssInterface.drawAll();