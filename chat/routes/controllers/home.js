function home(req, res) {
	res.sendFile(__dirname + "/chat/views/index.html");
}

module.exports = home;