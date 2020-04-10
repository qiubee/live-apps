(function() {
	const socket = io();

	// Ask to enter username
	socket.emit("username", prompt("Enter a username to start chatting:"));

	const form = document.querySelector("form");
	form.addEventListener("submit", function(event) {
		event.preventDefault();
		const input = document.getElementById("m").value;
		if (input === "") {
			return false;
		}
		switch (true) {
		case (chatStatus):
			socket.emit("chat message", input);
			socket.emit("commands", input);
			console.info("Chat:", "active");
			break;
		case (writingStarStatus):
			socket.emit("commands", input);
			socket.emit("writing star message", input);
			console.info("WS:", "active");
			break;
		}
		input.value = "";
		form.reset();
		return false;
	});

	socket.on("status", function(chat, bot) {
		chatStatus = chat;
		writingStarStatus = bot;
	});

	socket.on("chat message", function(message) {
		sendMessage(message);
	});

	socket.on("commands", function(message) {
		sendMessage(message, "bot");
	});

	socket.on("writing star message", function(message) {
		console.log("star message");
		sendMessage(message, "write");
	});

	socket.on("general", function(message) {
		sendMessage(message, "general");
	});

	function sendMessage(message, type) {
		if (typeof message !== "string") {
			return;
		}
		const msg = addMessage(message);
		if (type) {
			switch (type) {
			case "general":
				msg.setAttribute("class", "general");
				break;
			case "bot":
				msg.setAttribute("class", "bot");
				break;
			case "write":
				msg.setAttribute("class", "write");
				break;
			}
		}
		document.getElementById("messages").appendChild(msg);
	}

	function addMessage(message) {
		const text = document.createTextNode(message);
		const li = document.createElement("li");
		li.appendChild(text);
		return li;
	}
})();