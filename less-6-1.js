const socket = require('socket.io');
const http = require('http');
const path = require('path');
const fs = require('fs');
const rn = require('random-name');

const arrClients = [];

const server = http.createServer((req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    const readStream = fs.createReadStream(indexPath);

    readStream.pipe(res);
}).listen(5555)

const io = socket(server);

io.on('connection', (client) => {
    connect(client);

    client.on('client-msg', data => {
        sendToAll(client, 'server-msg', payload);
    });

    client.on('disconnect', () => {
        disonnect(client);
    });
});

function connect(client) {
    const nick = genNick();
    arrClients.push({ nick, id: client.id });

    sendToClient(client, 'server-init-client', { nick });
    sendToAll(client, 'server-msg', { nick, message: 'подключился.' });
    sendUpdClientsList(client);
}

function disonnect(client) {
    const idx = arrClients.findIndex((el) => el.id === client.id);
    if (idx >= 0) {
        sendToAll(client, 'server-msg', { nick: arrClients[idx].nick, message: 'отключился.' });
        arrClients.splice(idx, 1);

        sendUpdClientsList(client);
    }
}

function genNick() {
    return rn.first();
}

function sendToClient(client, msg, data) {
    client.emit(msg, data);
}

function sendToAll(client, msg, data) {
    client.emit(msg, data);
    client.broadcast.emit(msg, data);
}

function sendUpdClientsList(client) {
    const list = arrClients.map((el) => {
        return el.nick;
    }).join('\n');

    sendToAll(client, 'server-upd-clients', { clients: list });
}
