function travel(req, res) {
	res.sendFile("./travel.html", { root: "stock/views" });
}

module.exports = travel;