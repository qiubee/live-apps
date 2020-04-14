exports.createWritersList = function createWritersList(users) {
	const writersList = users.map(function (user) {
		return {
			writer: user,
			points: 0,
			currentStars: 0,
			maxStars: 5
		};
	});
	return writersList;
};

exports.addUserToWritersList = function addUserToWritersList(user, writersList) {
	const writer = {
		writer: user,
		points: 0,
		currentStars: 0,
		maxStars: 5
	};
	writersList.push(writer);
};

exports.clearWritersList = function clearWritersList(writersList) {
	writerslist = [];
	return writersList;
};

exports.updateWriterScore = function updateWriterScore(user, message, writersList) {
	console.log(user, message, writersList);

	// for (const writer of writers) {
	// 	console.log("User: " + writer + "\nWriter: " + user);
		
	// if (user === writer) {
	// 	console.log(updatePoints(user.points, checkMessage(message)));
	// 	user.points =+ updatePoints(user.points, checkMessage(message));
	// 	user.currentStars = updateStars(user.currentStars);
	// }
	// }
};

function updateStars(points) {
	switch (true) {
	case (points < 250): 
		return 0;
	case (points >= 250 && points < 750): 
		return 1;
	case (points >= 750 && points < 1500): 
		return 2;
	case (points >= 1500 && points < 2500): 
		return 3;
	case (points >= 2500 && points < 4000): 
		return 4;
	case (points >= 4000 && points < 6000): 
		return 5;
	}
}

function updatePoints(currentPoints, newPoints) {
	const total = currentPoints + newPoints;
	if (total < 0) {
		return 0;
	} else if (total > 6000) {
		return 6000;
	} else {
		return total;
	}
}

function checkMessage(message) {
	let score = checkGrammar(message);
	score = checkSpelling(message);
	return score;
}

function checkGrammar(message) {
	let points = 0;

	// Check for capital letter at the beginning of message
	switch (/^[A-Z]/g.test(message)) {
	case true:
		points =+ 50;
		break;
	case false:
		points =- 75;
		break;
	}

	// Check for period at the end of message
	switch (/\.$/gm.test(message) || /\?$/gm.test(message) || /\!$/gm.test(message)) {
	case true:
		points =+ 50;
		break;
	case false:
		points =- 75;
		break;
	}

	// Check for complete sentences
	switch (true) {
	case /\. [A-Z]/g.test(message): 
		points =+ 125;
		break;
	case /\. [^A-Z]/g.test(message): 
		points =- 100;
		break;
	case /  /g.test(message): 
		points =- 150;
		break; 
	case /(\.|\,)  /g.test(message): 
		points =- 175;
		break;
	}
	return points;
}

function checkSpelling(message) {
	let points = 0;

	// commonly mispelled words (https://en.wikipedia.org/wiki/Commonly_misspelled_English_words)
	switch (true) {
	case /awfull/g.test(message):
		points =- 75;
		break;
	case /concensus/g.test(message):
		points =- 75;
		break;
	case /equiptment/g.test(message):
		points =- 75;
		break;
	case /independant/g.test(message):
		points =- 75;
		break;
	case /readible/g.test(message):
		points =- 75;
		break;
	case /usible/g.test(message):
		points =- 75;
		break;
	case /helo/g.test(message):
		points =- 75;
		break;
	case /suprise/g.test(message):
		points =- 75;
		break;
	case /untill/g.test(message):
		points =- 75;
		break;
	}
	return points;
}