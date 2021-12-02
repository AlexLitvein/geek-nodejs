// Алгороитм "Решето Эратосфена"
// Идея взята отсюда https://prog-cpp.ru/eratosfen/

const colors = require('colors');
let [min, max] = process.argv.slice(2).map(el => Number(el));

function fillArr(min, max) {
    const arr = [];
    for (let i = min; i <= max; i++) {
        arr[i] = min++;
    }
    return arr;
}

function filterArr(arr) {
    const len = arr.length;
    for (let i = 2; i < len; i++) {
        for (let j = i * i; j < len; j += i) {
            arr[j] = 0;
        }
    }
}

function printArr(arr) {
    const colorsFuncs = [
        colors.green,
        colors.yellow,
        colors.red
    ];

    const res = arr.filter(el => el != 0);
    if (res.length) {
        res.forEach((el, i) => {
            console.log(colorsFuncs[i % 3](el));
        });
    } else {
        console.log('Нет простых чисел в этом диапазоне.'.red);
    }
}

if (min && max && min >= 2) {
    const arr = fillArr(min, max);
    filterArr(arr);
    printArr(arr);

} else {
    console.log('Bad range! Min number in range should be >= 2'.red);
}
