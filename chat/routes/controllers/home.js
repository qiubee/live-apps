function home(req, res) {
	res.sendFile("./index.html", {root: "chat/views"});
}

module.exports = home;