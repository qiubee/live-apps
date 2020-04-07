(function() {
	const socket = io();
	const form = document.querySelector("form");
	form.addEventListener("submit", function(event) {
		event.preventDefault();
		const input = document.getElementById("m").value;
		socket.emit("chat message", input);
		input.value = "";
		return false;
	});

	socket.on("chat message", function(message) {
		addMessageToChat(addMessage(message));
	});

	socket.on("general", function(message) {
		const msg = addMessage(message);
		msg.setAttribute("class", "general");
		addMessageToChat(msg);
	});

	function addMessage(message) {
		const text = document.createTextNode(message);
		const li = document.createElement("li");
		li.appendChild(text);
		return li;
	}

	function addMessageToChat(message) {
		document.getElementById("messages").appendChild(message);
	}
})();