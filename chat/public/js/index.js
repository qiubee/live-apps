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
		document.getElementById("messages").appendChild("li").textContent(message);
	});
})();