# Live apps

Series of apps that use [socket.io](https://github.com/socketio/socket.io) for real-time data rendering and manipulation.

## Contents

1. [**Dependencies**](#dependencies)
2. [**Installation**](#installation)
3. [**Main (untitled)**](#main-untitled)
   * [About](#about-concept)
   * [API's](#apis)
4. [**Chat**](#chat)
   * [About Chat](#about-chat)
   * [Unique Features](#unique-features)
   * [Custom events](#custom-events)
   * [Underlying code](#code)
5. [**Resources**](#resources)
6. [**License**](#license)

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

```bash
npm run chat
```

**4.** Open `localhost:8000` in the browser

## Main (untitled)

To run the (---) app: (---).

### About (concept)

Using real-time information about driving trains and the current stock market to give the current stock prices based on trains currently driving. This app shows you the current stock exchange, but with a twist: the rate at which the stock values are updated is based on the punctuality of a driving train. The session will also end when the train has arrived on its final destination.

**Unique feature:** Select a train and watch the current stock price of selected stocks, but if the train is running late the rate of the stocks being updated will also be delayed.

### API's

* [NS Developer API](https://apiportal.ns.nl/) (train information) [possible]
*  (stock information)

## Unique Features

## Chat

To run the chat app: `npm run chat`.

### About Chat

A chat app with a unique feature to communicate with eachother. [Express](https://www.npmjs.com/package/express) and [socket.io](https://www.npmjs.com/package/socket.io) have been used to create the app.

The chat app has the following features:

* [Writing Star](#unique-features)

### Unique Features

#### Writing Star

When the user has sent a message, it will check if the message has been written correctly. If so, it will reward points but if the message contains spelling errors or incorrect grammar the user will lose points. The more points you earn, the more stars you get. A user can get a maximum amount of 5 stars.

#### Code explanation

### Custom events

#### Server events

* [`username`](#username)
* [`commands`](#commands)
* [`writing star message`](#writing-star-message)

##### username

Save username received from client, create unique user and save in list.

##### commands

Check a message received from the client on commands and serve the correct instructions if a command has been called.

##### writing star message

If the **!write** command has been called the [Writing Star](#writing-star) game will start.

#### Client events

* [`status`](#status)

##### status

The client will send the status of the current chat e.g. normal chat is active or the Writing Star chat is active.

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
    console.log("Listening on port localhost:8000");
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

After the server was created I copied the HTML and CSS and created the JavaScript file:

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

Following the tutorial, when a user enters the message it should - instead of reloading the page and sending the message to the server - send it immidiately to the server without reloading. In the tutorial JQuery was used to achieve it, but instead I used regular JavaScript:

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

To show what message has been sent to the server I added the *chat message* feature in the server.js file. Now the code looks like this:

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
});
```

Doing these *custom* events it's possible to create different features based on the event name.

#### Show message to chat

## Resources

* [socket&#46;io - Get Started Tutorial](https://socket.io/get-started/chat)

## License

[GNU General Public License v2.0](LICENSE)
