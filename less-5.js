const fs = require("fs");
const path = require("path");
const http = require('http');
const cluster = require('cluster');
const os = require('os');

const isFile = fileName => {
    return fs.lstatSync(fileName).isFile();
}

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        console.log(`Forking process number ${i}...`);
        cluster.fork();
    }
} else {
    console.log(`Worker ${process.pid} started...`);
    http.createServer((req, res) => {
        if (req.method === 'GET') {
            getHandler(req, res);
        } else {
            res.writeHead(405, 'Not allowed');
            res.end('Method not allowed');
        }
    }).listen(3000);
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

            res.end(list.map((el) => {
                return `<p><a href=${el}>${el}</a></p>`;
            }).join(''));

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