'use strict'
// Importing dgram module
const dgram = require('dgram');
const { v4: uuid } = require('uuid');

// proces cli arguments
const argv = process.argv;

if (argv.length < 3) {
    console.log("instrument is not defined");
    process.exit(1);
}

const messages = new Map([
    ["piano", "ti-ta-ti"],
    ["trumpet", "pouet"],
    ["flute", "trulu"],
    ["violin", "gzi-gzi"],
    ["drum", "boum-boum"]
]);

if (!messages.has(argv[2])) {
    console.log("instrument is not defined");
    process.exit(1);
}

const addr = "230.185.192.108";
const port = 42069;
const message = JSON.stringify({
    sound: messages.get(argv[2]),
    id: uuid(),
    time: new Date()
});

const client = dgram.createSocket("udp4");

setInterval(function () {
    client.send(
        message,
        0,
        message.length,
        port,
        addr,
        (err) => {
            if (err) console.log(err);

            // console.log("Message sent");
        }
    );
}, 1000);



