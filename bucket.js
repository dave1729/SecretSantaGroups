function Bucket(number) {
	this.number = number;
	this.groupsInBucket = {};
	this.participantsInBucket = [];
}

Bucket.prototype.addParticipant = function(participant) {
	if(participant.group === null) {
		console.log("Just throw this one in.");
		this.participantsInBucket.push(participant);
		return true;
	}
	else if(this.groupsInBucket[participant.group.name] === true) {
		console.log(participant.group.name + " is already Here. See, " + this.groupsInBucket[participant.group.name]);
		return false;
	}
	else {
		console.log("Well... this is new.");
		this.groupsInBucket[participant.group.name] = true;
		this.participantsInBucket.push(participant);
		return true;
	}
}

//Use an object. To add a key to the set, do:
//
//object[key] = true;
//
//To test whether a key is in the set, do:
//
//if (object.hasOwnProperty(key)) { ... }
//
//To remove a key from the set, do:
//
//delete object[key]
