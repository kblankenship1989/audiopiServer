import fs from 'fs';
import { exec } from 'child_process';

//var fifo = process.env.PIANOBAR_FIFO || '/home/pi/Patiobar/ctl';
var fifo = '/Blankenship/github/audiopiServer/public/ctl';
export const writeCommandToFifo = (action) =>  {
    return fs.promises.open(fifo, 'w', 0o644)
        .then((fileHandle, error) => {
            console.log('Fifo opened');
            if (error) {
                console.log('Error opening fifo: ' + error);
                return error;
            }

            var buf = new Buffer.from(action);

            return fileHandle.write(buf, 0, action.length, null);
        })
        .catch((error) => error);
}

export const readCurrentSong = () => {
    //const path = process.env.HOME + '/.config/pianobar/currentSong';
    const path = '/Blankenship/github/audiopiServer/public/currentSong';
    return fs.promises.open(path,'r')
        .then((fileHandle, error) => {
            console.log('reading current song')
            if (error) {
                return error;
            }
            return fileHandle.readFile();
        })
        .catch((error) => error);
}

export const readStations = () => {
    //const path = process.env.HOME + '/.config/pianobar/stationList';
    const path = '/Blankenship/github/audiopiServer/public/stationList';
    return fs.promises.open(path,'r')
        .then((fileHandle, error) => {
            console.log('reading station list')
            if (error) {
                return error;
            }
            return fileHandle.readFile();
        })
        .catch((error) => error);
}

export const startPianoBar = (callBack) => {
    //exec('bash /home/pi/Patiobar/scripts/pbstart.sh', callBack);
    exec('bash /h/Blankenship/github/audiopiServer/public/pbStart.sh', callBack)
}

export const stopPianoBar = (callBack) => {
    //exec('bash /home/pi/Patiobar/scripts/pbstop.sh', callBack);
    exec('bash /h/Blankenship/github/audiopiServer/public/pbStop.sh', callBack)
}