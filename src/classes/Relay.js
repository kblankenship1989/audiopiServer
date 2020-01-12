import {Gpio} from 'onoff';

export class Relay {
    constructor(dataPin, latchPin, clockPin) {
        this.data = new Gpio(dataPin, 'out');
        this.latch = new Gpio(latchPin, 'out');
        this.clock = new Gpio(clockPin, 'out');
    }

    setRelays(newState) {
        const state = parseInt(newState, 16);
        this.latch.writeSync(0);
        this.clock.writeSync(0);
        let j=0;
        for (j=0;j<16;j++){
            this.data.writeSync((state >> j) & 1);
            this.clock.writeSync(1);
            this.clock.writeSync(0);
        }
        this.latch.writeSync(1);
    }
}