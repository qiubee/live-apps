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
let members = 0;
chat.on("connection", function(socket) {
	members++;
	console.log("a user connected (" + members + " total members)");

	socket.emit("general", "Welcome to the chat!");
	socket.broadcast.emit("general", "New user joined!");

	socket.on("chat message", function(message) {
		console.log("Message: " + message);
		chat.emit("chat message", message);
	});

	socket.on("disconnect", function() {
		members--;
		socket.broadcast.emit("general", "User left.");
		console.log("user disconnected (" + members + " members remaining)");
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