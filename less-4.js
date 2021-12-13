#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");

let currentDirectory = process.cwd();

const isFile = fileName => {
    return fs.lstatSync(fileName).isFile();
}

// const list = fs.readdirSync(currentDirectory).filter(isFile);
// const list = fs.readdirSync(currentDirectory);

// inquirer
//     .prompt([
//         {
//             name: "fileName",
//             type: "list",
//             message: "Choose file:",
//             choices: list,
//         },
//     ])
//     .then((answer) => {
//         const filePath = path.join(currentDirectory, answer.fileName);

//         fs.readFile(filePath, 'utf8', (err, data) => {
//             console.log(data);
//         });
//     });

function findInStream(fileName, pattern) {
    const readStream = fs.createReadStream(fileName,
        {
            encoding: 'utf-8',
            // highWaterMark: 32,
        });

    readStream.on('data', (chunk) => {
        // const arr = (tailChunk + chunk).split('\n');
        // tailChunk = arr.pop();

        // arr.forEach(el => {
        //     elHandler(el, finds);
        // });
        if (chunk.includes(pattern)) {
            console.log('finds!');
        }
    });
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
        // console.log('not file');
        choseFile();
    } else {
        const filePath = path.join(currentDirectory, answer.fileName);
        // fs.readFile(filePath, 'utf8', (err, data) => {
        //     console.log(data);
        // });

        const ans2 = await inquirer.prompt([
            {
                name: "strToFind",
                type: "input",
                message: "Введите строку для поиска:",
            },
        ]);

        findInStream(filePath, ans2.strToFind);
    }

}

choseFile();//'substringLength'

