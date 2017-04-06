function Bucket(number) {
	this.number = number;
	this.groupsInBucket = {};
	this.participantsInBucket = [];
}

Bucket.prototype.addParticipant = function(participant) {
	if(participant.group === null) {
		console.log("Participant has no group, added to bucket.");
		this.participantsInBucket.push(participant);
		return true;
	}
	else if(this.groupsInBucket[participant.group.name] === true) {
		console.log("There is already a participant from " + participant.group.name + " in this bucket, NOT added to bucket.");
		return false;
	}
	else {
		console.log("Participant in group " + participant.group.name + ", added to bucket.");
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
