function home(req, res) {
	res.sendFile("./index.html", {root: "chat/public"});
}

module.exports = home;