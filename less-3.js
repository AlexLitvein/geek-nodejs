const fs = require('fs');
let tailChunk = '';
const finds = ['89.123.1.41', '34.48.240.111'];

function elHandler(el, finds) {
    for (let i = 0; i < finds.length; i++) {
        const s = finds[i];
        if (el.includes(s)) {
            // console.log(el);
            fs.writeFile(`${s}_requests.log`, el, { flag: 'a' }, (err) => { }); // console.log(err)
            break;
        }
    }
}

const readStream = fs.createReadStream('./access.log',
    {
        encoding: 'utf-8',
        // highWaterMark: 32,
    });

readStream.on('data', (chunk) => {
    const arr = (tailChunk + chunk).split('\n');
    tailChunk = arr.pop();

    arr.forEach(el => {
        elHandler(el, finds);
    });
});


