const fs = require("fs");
const path = require("path");
const http = require('http');
const cluster = require('cluster');
const os = require('os');
const socket = require('socket.io');

let count = 0;
let io = null;
const numCPUs = os.cpus().length;

const isFile = fileName => {
    return fs.lstatSync(fileName).isFile();
}

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        console.log(`Forking process number ${i}...`);
        cluster.fork();
    }
} else {
    console.log(`Worker ${process.pid} started...`);
    const server = http.createServer((req, res) => {
        if (req.method === 'GET') {
            getHandler(req, res);
        } else {
            res.writeHead(405, 'Not allowed');
            res.end('Method not allowed');
        }
    }).listen(3000);

    io = socket(server);

    io.on('connection', (client) => {
        connect(client);
    
        client.on('disconnect', () => {
            disonnect(client);
        });
    });
}

function connect(client) {
    count++;
    sendToAll(client, 'server-msg', { count });
}

function disonnect(client) {
    count--;
    sendToAll(client, 'server-msg', { count });   
}

function sendToAll(client, msg, data) {
    client.emit(msg, data);
    client.broadcast.emit(msg, data);
}

function getHandler(req, res) {
    if (req.url.includes('favicon.ico')) {
        res.end();
        return;
    }

    const filePath = path.join(__dirname, req.url);
    try {
        const result = isFile(filePath);
        if (!result) {
            const list = fs.readdirSync(filePath);
            res.writeHead(200, 'OK', {
                'Content-Type': 'text/html',
            });

            const content = list.map((el) => {
                return `<p><a href=${req.url + el + '/'}>${el}</a></p>`;
            }).join('');

            const cb = (fileData)=> {
                const out = fileData.replace('##content', content).replace('##stat', `Просматривают страницу ${count} пользователей.`);
                res.end(out);
            }

            readFileMy(path.join(__dirname, 'index_6-2.html'), cb);

        } else {
            const readStream = fs.createReadStream(filePath);
            res.writeHead(200, 'OK', {
                'Content-Type': 'text/plain; charset=utf-8',
            });
            readStream.pipe(res);
        }
    } catch (error) {
        res.writeHead(404, 'Not found');
        res.end('Not found');
    }
}

function readFileMy(fileName, cb) {
    let fileData = '';
    const readStream = fs.createReadStream(fileName, 'utf-8');

    readStream.on('data', (data) => {
        fileData += data;
    });

    readStream.on('error', (err) => {
        console.log(err.message);
    });

    readStream.on('end', () => {
        cb(fileData);
    });
}
