#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const readline = require("readline");
const http = require('http');
const url = require('url');

let currentDirectory = process.cwd();

const isFile = fileName => {
    return fs.lstatSync(fileName).isFile();
}

function findInStream(fileName, pattern) {
    let count = 0;
    const readStream = fs.createReadStream(fileName,
        {
            encoding: 'utf-8',
            // highWaterMark: 32,
        });

    const rl = readline.createInterface({ input: readStream, terminal: true });

    rl.on('line', (line) => {
        const res = line.match(pattern);
        if (res) {
            console.log(`Совпадение найдено в ${count}-ой строке по индексу: ${res.index}`);
            count++;
        }
    });

    readStream.on('error', (err) => {
        console.log(err.message);
    });

    readStream.on('end', () => {
        console.log(`Найдено ${count} совпадений`);
    });
}

function findAction(filePath) {
    // Наверное все функции надо переписать на промисах, чтобы 
    // не было рекурсивных вызовов и стек оставался чистым
    Promise.resolve().then(async () => {
        const ans = await inquirer.prompt([
            {
                name: "strToFind",
                type: "input",
                message: "Введите строку для поиска или рег выражение например: \\w*ti\\w*",
            },
        ]);
        findInStream(filePath, ans.strToFind);
    });
}

async function choseAction() {
    const list = ["1. Ввести полное имя файла", "2. Выбрать из списка"];
    const answer = await inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "Выберите действие:",
            choices: list,
        },
    ]);

    const n = +answer.action.charAt(0);
    if (n === 1) {
        const ans1 = await inquirer.prompt([
            {
                name: "path",
                type: "input",
                message: "Введите полное имя файла:",
            },
        ]);
        findAction(ans1.path);
    } else {
        choseFile();
    }
}

async function choseFile() {
    const list = fs.readdirSync(currentDirectory);

    const answer = await inquirer.prompt([
        {
            name: "fileName",
            type: "list",
            message: "Choose file:",
            choices: list,
        },
    ]);

    const filePath = path.join(currentDirectory, answer.fileName);
    if (!isFile(filePath)) {
        currentDirectory = filePath;
        choseFile();
    } else {
        findAction(filePath);
    }
}

// choseAction();

const server = http.createServer((req, res) => {
    console.log('Ok!');
    console.log('url:', req.url);
    console.log('method:', req.method);
    console.log('headers:', req.headers);

    res.setHeader('my-header', 'my-nodejs-header');
    res.writeHead(200, 'OK', {
        'test-header': 'test',
    });
    res.write('Hello from Node.js!');
    res.end('Hello from Node.js!');
    res.end();

    // URL
    if (req.url === '/user') {
        res.end('User found');
    } else {
        res.writeHead(
            404,
            'Not found',
            {
                'test': 'test',
            },
        );
        res.end();
    }

    // Method
    if (req.method === 'GET') {
        res.end('Hello!');
    } else {
        res.writeHead(405, 'Not allowed');
        res.end('Method not allowed');
    }

    console.log(req.url);
    const { query } = url.parse(req.url, true);
    console.log(query);

    const data = JSON.stringify(query);
    res.end(data);

    if (req.method === 'POST') {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => {
            const parsedData = JSON.parse(data);
            console.log(data);
            console.log(parsedData);
            res.writeHead(200, 'OK', {
                'Content-Type': 'application/json',
            })

            res.end(data);
        });
    } else {
        res.end();
    }
    res.writeHead(200, 'OK', {
        'Content-Type': 'text/html',
    })
    readStream.pipe(res);
});

server.listen(3000);