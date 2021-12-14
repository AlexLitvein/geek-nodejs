const EventEmitter = require('events');
const { DateTime } = require("luxon");

class MyEmitter extends EventEmitter { };
const emitterObject = new MyEmitter();

const arr = [
    {
        endTime: DateTime.fromISO('2021-12-08T12:38:00')
    }
]

function tickHandler() {
    console.log('tick');
    arr.forEach((el, idx) => {
        // const curr = Date.now();
        console.log(DateTime.now().diff(el.endTime, ['days', 'hours']).toObject());
        // if (el.endTime > curr) {
        //     console.log(`До начала События ${idx} осталось ${new Date(el.endTime - curr)}`);
        // } else {
        //     console.log(`Событие ${idx} наступило.`);
        // }
    });

}

// const timeoutObj = {
//     // name: '',
//     endTime: 0
// };



emitterObject.on('tick', tickHandler);
setInterval(() => emitterObject.emit('tick'), 1000);

// const dataIn = DateTime.fromISO('2021-12-05T11:38:00');
// console.log(dataIn.toFormat('dd-MM-yyyy TT'));
// console.log(dataIn.toLocaleString(DateTime.TIME_24_WITH_SECONDS));
