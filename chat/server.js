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

// chat sockets
let members = [];
chat.on("connection", function(socket) {
	let user;
	console.log("a user connected...");
	
	socket.on("username", function(username) {
		user = saveUser(username);
		console.log("new user: " + user + " (" + members.length + " total members)");
		socket.emit("general", "Welcome to the chat " + user + "!");
		socket.broadcast.emit("general", name + " joined the chat!");
	});

	socket.on("chat message", function(message) {
		console.log(user + " messaged: " + message);
		console.log("current members:", members);
		chat.emit("chat message", user + ": " + message);
	});

	socket.on("disconnect", function() {
		socket.broadcast.emit("general", user + " left the chat.");
		removeUser(user);
		console.log(user + " disconnected (" + members.length + " members remaining)");
	});
});

server.listen(port, function () {
	console.log(`Listening on port \u001b[1m\u001b[36m${port}\u001b[0m\n\u001b[1m\u001b[36mlocalhost:${port}\u001b[0m`);
});

function saveUser(user) {
	name = createUsername(user);
	members.push(name);
	return name;
}

function createUsername(username) {
	if (username === null) {
		username = "Anonymous";
	}
	username = username + "#" + (members.length + 1);
	return username;
}

function removeUser(user) {
	if (members.length > 0) {
		members = members.filter(function(member) {
			return member !== user;
		});
		return members;
	}
}

function rewardMember() {

}

function updateStars() {
    
}

function checkGrammar() {

}