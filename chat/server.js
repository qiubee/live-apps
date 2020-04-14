const express = require("express");
const router = require("./routes/router");
const { chat } = require("./features/chat");

// server
const app = express();
const server = require("http").createServer(app);

const port = 8000;

// use public folder for static files
app.use(express.static("chat/public"));

// routing
app.use("/", router);

// chat
chat(server);

server.listen(port, function () {
	console.log(`Listening on port \u001b[1m\u001b[36m${port}\u001b[0m\n\u001b[1m\u001b[36mlocalhost:${port}\u001b[0m`);
});