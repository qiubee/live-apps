const express = require("express");
const router = require("./routes/router");

// server
const app = express();
const server = require("http").createServer(app);
const chat = require("socket.io")(server);
const port = 8000;

// use public folder for static files
app.use(express.static("chat/public"));

// routing
app.use("/", router);

// chat
let members = [];
let writers = [];
chat.on("connection", function (socket) {
	let user;
	console.log("a user connected...");
	chat.emit("status", true, false);
	
	socket.on("username", function (username) {
		user = saveUser(username);
		const name = user.replace(/#\d/g, "");
		console.log("new user: " + user + " (" + members.length + " total members)");
		socket.emit("general", "Welcome to the chat " + name + "!");
		socket.broadcast.emit("general", name + " joined the chat!");
	});

	socket.on("chat message", function (message) {
		console.log(user + " messaged: " + message);
		if (message === "") {
			return;
		}
		if (/^\!(?!write)[a-z]/g.test(message) === true) {
			socket.emit("chat message", user + " (You): " + message);
			return;
		}
		const username = user.substring(0, user.length - 2);
		socket.emit("chat message", username + ": " + message);
		socket.broadcast.emit("chat message", user + ": " + message);
	});

	socket.on("commands", function (message) {
		switch (message) {
		case "!write":
			writeCommand(true);
			return;
		case "!/write":
			writeCommand(false);
			return;
		}
		if (message.charAt(0) === "!" && /^\![a-z]/g.test(message) === true) {
			console.log("Unknown command: " + message);
			socket.emit("commands", "Command: \"" + message + "\" not found");
			socket.emit("commands", "Available commands: !write");
		}
	});

	socket.on("writing star message", function (message) {
		console.log(user + " messaged: " + message);
		updateWriterStatus(user, message);
		console.log(writers);
		chat.emit("writing star message", user + ": " + message);
	});

	socket.on("disconnect", function () {
		socket.broadcast.emit("general", user + " left the chat.");
		console.log(user + " disconnected (" + members.length + " members remaining)");
		removeUser(user);
	});
});

server.listen(port, function () {
	console.log(`Listening on port \u001b[1m\u001b[36m${port}\u001b[0m\n\u001b[1m\u001b[36mlocalhost:${port}\u001b[0m`);
});

// Delays
async function shortDelay() {
	return await new Promise (function (res, rej) {
		setTimeout(function () {
			res();
		}, 200);
	});
}

async function longDelay() {
	return await new Promise (function (res, rej) {
		setTimeout(function () {
			res();
		}, 1250);
	});
}

// User functions
function saveUser(user) {
	const name = createUsername(user);
	members.push(name);
	return name;
}

function createUsername(username) {
	username = username.replace(/[\/%\^"'&\?\*\(\)\[\]{}\+=$ _`~!@\#<,>\.\:\;]/g, "");
	if (username === null || username === "" || username === undefined) {
		username = "Anonymous";
	}
	username = username + "#" + (members.length + 1);
	return username;
}

function removeUser(user) {
	if (members.length > 0) {
		members = members.filter(function (member) {
			return member !== user;
		});
		return members;
	}
}

// Command functions
async function writeCommand(status) {
	switch (status) {
	case true:
		console.log("command: Writing Star [\u001b[1m\u001b[32mactive\u001b[0m]");
		await shortDelay();
		chat.emit("commands", "Activating Writing Star bot...");
		chat.emit("status", false, true);
		initiateWritingStar();
		await longDelay();
		chat.emit("commands", "Writing Star [active]");
		await shortDelay();
		chat.emit("commands", "\u24D8 Write correct sentences, score points and show off your writing skills.");
		chat.emit("commands", "\u24D8 Watch your words!");
		break;
	case false:
		console.log("command: Writing Star [\u001b[1m\u001b[31mstopped\u001b[0m]");
		removeWriters();
		await longDelay();
		chat.emit("status", true, false);
		chat.emit("commands", "Writing Star [stopped].");
		break;
	}
}

// Writing Star functions
function initiateWritingStar() {
	writers = members.map(function (user) {
		return {
			writer: user,
			points: 0,
			currentStars: 0,
			maxStars: 5
		};
	});
	console.log("Writers:", writers);
}

function addWritingStar(user) {
	const writer = {
		writer: user,
		points: 0,
		currentStars: 0,
		maxStars: 5
	};
	writers.push(writer);
}

function removeWriters() {
	writers = [];
}

function updateWriterStatus(user, message) {
	console.log(writers);
	console.log(writers[0]);
	console.log(writers[0].writer);
	for (const writer of writers) {
		console.log("User: " + writer + "\nWriter: " + user);
		
		// if (user === writer) {
		// 	console.log(updatePoints(user.points, checkMessage(message)));
		// 	user.points =+ updatePoints(user.points, checkMessage(message));
		// 	user.currentStars = updateStars(user.currentStars);
		// }
	}
}

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