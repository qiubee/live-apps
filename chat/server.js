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
	let name;
	console.log("a user connected...");
	socket.emit("general", "Welcome to the chat!");
	
	socket.on("username", function(username) {
		if (username === null) {
			username = "Anonymous";
		}
		console.log("new user: " + username + " (" + (members.length + 1) + " total members)");
		name = username + "#" + members.length;
		members.push(name);
		console.log("members:", members);
		socket.broadcast.emit("general", name + " joined the chat!");
	});

	socket.on("chat message", function(message) {
		console.log(name + " messaged: " + message);
		chat.emit("chat message", name + ": " + message);
	});

	socket.on("disconnect", function() {
		socket.broadcast.emit("general", name + " left.");
		if (members.length < 0) {
			members = members.reduce(function(member, currentMember) {
				if (member !== currentMember) {
					member.push(member);
				} return member;
			}, []);
		}
		console.log(members);
		console.log("user disconnected (" + members.length + " members remaining)");
	});
});

server.listen(port, function () {
	console.log(`Listening on port \u001b[1m\u001b[36m${port}\u001b[0m\n\u001b[1m\u001b[36mlocalhost:${port}\u001b[0m`);
});

function rewardMember() {

}

function updateStars() {
    
}

function checkGrammar() {

}