const express = require("express");
const hbs = require("express-handlebars");
const router = require("./routes/router");
const { stock } = require("./stock");

// server
const app = express();
const server = require("http").createServer(app);
const port = 8000;

// set handlebars as templating engine
app.set("view engine", "hbs");
app.engine( "hbs", hbs({ 
	extname: "hbs", 
	defaultLayout: "default", 
	layoutsDir: __dirname + "/views/layouts/",
	partialsDir: __dirname + "/views/partials/"
}));

// use public folder for static files
app.use(express.static("stock/public"));

// routing
app.use("/", router);

// stock
stock(server);

server.listen(port, function () {
	console.log(`Listening on port \u001b[1m\u001b[36m${port}\u001b[0m\n\u001b[1m\u001b[36mlocalhost:${port}\u001b[0m`);
});