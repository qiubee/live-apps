exports.stock = function stock(server) {
	const stock = require("socket.io")(server);

	stock.on("connection", function (socket) {

	});
};