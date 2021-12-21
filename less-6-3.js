#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");

const findInStream = require('./module')

let currentDirectory = process.cwd();

const isFile = fileName => {
    return fs.lstatSync(fileName).isFile();
}

function findAction(filePath) {
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

choseAction();
