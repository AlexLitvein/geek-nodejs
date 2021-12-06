const EventEmitter = require('events');
const { DateTime } = require("luxon");

class MyEmitter extends EventEmitter { };
const emitterObject = new MyEmitter();

class TimeOutObj {
    constructor(data) {
        this.isEnd = false;
        this.endTime = DateTime.fromFormat(data, "HH-dd-MM-yyyy");
        if (this.endTime.invalidExplanation) {
            throw this.endTime.invalidExplanation;
        }
    }

    print(idx) {
        const curr = DateTime.now();
        if (this.isEnd === false && curr < this.endTime) {
            const diff = curr.diff(this.endTime, ['years', 'months', 'days', 'hours', 'minutes', 'seconds']).toObject();
            console.log(`До начала События${idx} осталось: ${Math.abs(diff.years)} years ${Math.abs(diff.days)} days ${Math.abs(diff.hours)} hours ${Math.abs(diff.minutes)} minutes ${Math.trunc(Math.abs(diff.seconds))} seconds.`);
        } else {
            this.isEnd = true;
            console.log(`Событие${idx} наступило.`);
        }
    }
}

function tickHandler() {
    arr.forEach((el, idx) => {
        el.print(idx);
    });
}

const arr = [];
process.argv.slice(2).forEach(el => {
    try {
        arr.push(new TimeOutObj(el));        
    } catch (error) {
        console.log(error);
    }    
});

emitterObject.on('tick', tickHandler);
setInterval(() => emitterObject.emit('tick'), 1000);
