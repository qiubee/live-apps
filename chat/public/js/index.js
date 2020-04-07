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
		addMessage(message);
	});

	socket.on("general", function(message) {
		addMessage(message);
	});

	function addMessage(message) {
		const chatlist = document.getElementById("messages");
		const text = document.createTextNode(message);
		const li = document.createElement("li");
		li.appendChild(text);
		chatlist.appendChild(li);
	}
})();