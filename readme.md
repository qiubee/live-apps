# Live apps

Series of apps that use [socket.io](https://github.com/socketio/socket.io) for real-time data rendering and manipulation.

## Contents

1. [**Dependencies**](#dependencies)
2. [**Installation**](#installation)
3. [**Chat app**](#chat)
   * [About](#about)
   * [Unique Feature](#unique-feature)
   * [Underlying code](#code)
4. [**License**](#license)

## Dependencies

* Node.js
* Express
* socket&#46;io

For other dependencies see [**`package.json`**](package.json)

## Installation

**1. Clone repository**

```bash
git clone https://github.com/qiubee/live-apps.git

# Go to directory
cd live-apps
```

**2. Install dependencies**

```bash
npm install
```

**3. Run server**
Clone repository
```bash
npm run chat
```

**4.** Open `localhost:8000` in the browser

## Chat

To run the chat app: `npm run chat`.

### About

A chat app with a unique feature to communicate with eachother. [Express](https://www.npmjs.com/package/express) and [socket.io](https://www.npmjs.com/package/socket.io) have been used to create the app.

The chat app has the following features:

* Creating username
* Rooms
* [Writing Star](#unique-feature) (Unique Feature)

### Unique Feature

#### Writing Star

When the user has sent a message, it will check if the message has been written correctly. If so, it will reward points but if the message contains spelling errors or incorrect grammar the user will lose points. The more points you earn, the more stars you get. A user can get a maximum amount of 5 stars.

#### Code explanation

### Underlying Code

#### Create server

First I created the server:

**server.js**

```js
const express = require("express");
const router = require("./routes/router");

// server
const app = express();
const port = 8000;

// use public folder to serve static files
app.use(express.static("chat/public"));

// routing done in dedicated router file
app.use("/", router);

app.listen(port, function () {
    console.log(`Listening on port \u001b[1m\u001b[36m${port}\u001b[0m\n\u001b[1m\u001b[36mlocalhost:${port}\u001b[0m`);
});
```

#### Add socket&#46;io

Then after I created the server I added *socket&#46;io* following the [Get Started Tutorial](https://socket.io/get-started/chat) on the website. To get socket&#46;io to work it had to create another server from the already created and add it to socket&#46;io:

**server.js**

```js
// server
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = 8000;
```

Then on the server I've made the server listen to the new server instead of the app:

```js
server.listen(port, function () {});
```

After that I've copied the HTML and CSS:

**index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/index.css">
    <title>Chat</title>
</head>
<body>
    <ul id="messages"></ul>
    <form action="">
        <input id="m" autocomplete="off"><button>Send</button>
    </form>
    <script src="/socket.io/socket.io.js"></script>
    <script src="js/index.js"></script>
</body>
</html>
```

**index.css**

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font: 13px Helvetica, Arial;
}

form {
    background: #000;
    padding: 3px;
    position: fixed;
    bottom: 0;
    width: 100%;
}

form input {
    border: 0;
    padding: 10px;
    width: 90%;
    margin-right: .5%;
}

form button {
    width: 9%;
    background: rgb(130, 224, 255);
    border: none;
    padding: 10px;
}

#messages {
    list-style-type: none;
    margin: 0;
    padding: 0;
}

#messages li {
    padding: 5px 10px;
}

#messages li:nth-child(odd) {
    background: #eee;
}
```

Then I created the JavaScript file:

```js
const socket = io();
```

#### Connect client and server

On the server again, I made the connection between the client and the server:

```js
io.on("connection", function(socket) {
    console.log("a user connected");

    socket.on("disconnect", function() {
        console.log("user disconnected");
    });
});
```

#### Send message through socket

Following the tutorial, when a user enters the message it should instead of reloading the page and sending the message to the server send it immidiately to the server without reloading. To do that JQuery has been used in the tutorial to achieve that, but instead of that I used normal JavaScript to get it done:

**index.js**

```js
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
})();
```

To show what message has been sent to the server I added the following code:

```js
socket.on("chat message", function(message) {
        console.log("Message: " + message);
    });
```

Now the socket&#46;io looks like this:

**server.js**

```js
io.on("connection", function(socket) {
    console.log("a user connected");
    socket.on("disconnect", function() {
        console.log("user disconnected");
    });

    // show message in console
    socket.on("chat message", function(message) {
        console.log("Message: " + message);
    });
    // ---------
});
```

When the user writes for example "Hello" the following will log in the terminal:

```bash
Message: Hello
```

#### Show message to chat

## License

[GNU General Public License v2.0](LICENSE)
