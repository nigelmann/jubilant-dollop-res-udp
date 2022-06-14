const dgram = require('dgram'); 
const net = require('net')

const addr = "230.185.192.108";
const port = 42069;

const sounds = new Map([
    ["ti-ta-ti", "piano"],
    ["pouet", "trumpet"],
    ["trulu", "flute"],
    ["gzi-gzi", "violin"],
    ["boum-boum", "drum"]
]);

let activeMusicians = {};

const udpServer = dgram.createSocket("udp4");
 
// Catching the message event
udpServer.bind(port, () => udpServer.addMembership(addr)).on("message", (message) => {
    data = JSON.parse(message);
    if (!sounds.has(data.sound)) {
        return;
    }

    if (!activeMusicians.hasOwnProperty(data.id)) {
        // this is a new musician
        activeMusicians[data.id] = {
            uuid: data.id,
            instrument: sounds.get(data.sound),
            active_since: new Date(),
            last_seen: new Date(),
        };
    } else {
        activeMusicians[data.id].last_seen = new Date();
    }
});

const tcpServer = net.createServer();
tcpServer.listen(2205).on("connection",  socket => {
    const values = Object.entries(activeMusicians).map(v => v[1]);
    socket.write(JSON.stringify(values) + "\r\n");
    socket.end();
});

setInterval(() => {
    const musArray = Object.entries(activeMusicians);
    const now = new Date();
    const filtered = musArray.filter(([key, value]) => (now - value.last_seen) / 1000 < 5 );
    activeMusicians = Object.fromEntries(filtered);
}, 1000);

