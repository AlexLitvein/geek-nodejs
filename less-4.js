#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const readline = require("readline");

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

    if (!isFile(currentDirectory + '\\' + answer.fileName)) {
        currentDirectory += '\\' + answer.fileName;
        choseFile();
    } else {
        const filePath = path.join(currentDirectory, answer.fileName);
        findAction(filePath);
    }
}

choseAction();
