import {Gpio} from 'onoff';

export class Relay {
    constructor(dataPin, latchPin, clockPin) {
        this.data = new Gpio(dataPin, 'out');
        this.latch = new Gpio(latchPin, 'out');
        this.clock = new Gpio(clockPin, 'out');
    }

    setRelays(newState) {
        latch.writeSync(0);
        clock.writeSync(0);
        let j=0;
        for (j=0;j<16;j++){
            data.writeSync((newState >> j) & 1);
            clock.writeSync(1);
            clock.writeSync(0);
        }
        latch.writeSync(1);
    }
}