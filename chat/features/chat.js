// modules
const { shortDelay, longDelay } = require("./modules/delays");
const { saveUserToUserList, createUsername, removeUserFromList, createUniqueUser } = require("./modules/user");
const { addUserToWritersList, clearWritersList, updateWriterScore, createWritersList } = require("./modules/writing-star");

exports.chat = function chat(server) {
	const chat = require("socket.io")(server);
	let userList = [];
	let writersList = [];
	chat.on("connection", function (socket) {
		let currentUser, currentUsername;
		console.log("a user connected...");
		chat.emit("status", true, false);
	
		socket.on("username", function (userInput) {
			const username = createUsername(userInput);
			currentUsername = username;
			const user = createUniqueUser(username, userList);
			saveUserToUserList(user, userList);
			currentUser = user;
			console.log("new user: " + user + " (" + userList.length + " total members)");
			socket.emit("general", "Welcome to the chat " + username + "!");
			socket.broadcast.emit("general", user + " joined the chat!");
		});

		socket.on("chat message", function (message) {
			console.log(currentUser + " messaged: " + message);
			if (message === "") {
				return;
			}
			if (/^\!(?!write)[a-z]/g.test(message) === true) {
				socket.emit("chat message", currentUsername + " (You): " + message);
				return;
			}
			socket.emit("chat message", currentUsername + ": " + message);
			socket.broadcast.emit("chat message", currentUser + ": " + message);
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
			console.log(currentUser + " messaged: " + message);
			updateWriterScore(currentUser, message, writersList);
			console.log(writersList);
			socket.emit("writing star message", currentUsername + ": " + message);
			socket.broadcast.emit("writing star message", currentUser + ": " + message);
		});

		socket.on("disconnect", function () {
			socket.broadcast.emit("general", currentUser + " left the chat.");
			console.log(currentUser + " disconnected (" + userList.length + " members remaining)");
			removeUserFromList(currentUser);
		});
	});

	// Command functions
	async function writeCommand(status) {
		switch (status) {
		case true:
			console.log("[command] Writing Star \u001b[1m\u001b[32mactive\u001b[0m");
			await shortDelay();
			chat.emit("commands", "Activating Writing Star bot...");
			chat.emit("status", false, true);
			createWritersList(userList);
			await longDelay();
			chat.emit("commands", "Writing Star [active]");
			await shortDelay();
			chat.emit("commands", "\u24D8 Write correct sentences, score points and show off your writing skills.");
			chat.emit("commands", "\u24D8 Watch your words!");
			break;
		case false:
			console.log("[command] Writing Star \u001b[1m\u001b[31mstopped\u001b[0m");
			clearWritersList(writersList);
			await longDelay();
			chat.emit("status", true, false);
			chat.emit("commands", "Writing Star [stopped].");
			break;
		}
	}

};
