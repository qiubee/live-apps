const app = require("express")();

const port = 8000;

// use public folder for static files
app.use(express.static("public"));

// routing
app.use("/", router);

app.listen(port, function () {
    console.log(`Listening on port \u001b[1m\u001b[36m${port}\u001b[0m\n\u001b[1m\u001b[36mlocalhost:${port}\u001b[0m`);
});