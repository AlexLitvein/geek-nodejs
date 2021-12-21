const fs = require("fs");
const readline = require("readline");

function findInStream(fileName, pattern) {
    let count = 0;
    const readStream = fs.createReadStream(fileName, 'utf-8');

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

module.exports = findInStream;