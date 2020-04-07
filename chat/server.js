const express = require("express");
const router = require("./routes/router");

// server
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = 8000;

// use public folder for static files
app.use(express.static("chat/public"));

// routing
app.use("/", router);

io.on("connection", function(socket) {
	console.log("a user connected");
	socket.on("disconnect", function() {
		console.log("user disconnected");
	});

	socket.on("chat message", function(message) {
		console.log("Message: " + message);
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