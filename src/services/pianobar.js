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

export const readStations = (req, res, next) => {
    //const path = process.env.HOME + '/.config/pianobar/stationList';
    const path = '/Blankenship/github/audiopiServer/public/stationList';
    fs.promises.open(path,'r')
        .then((fileHandle, error) => {
            console.log('reading station list')
            if (error) {
                return next(error);
            }
            return fileHandle.readFile();
        })
        .then((stationList, error) => {
            if (error) {
                return next(error);
            }
            const stationListString = stationList.toString();
            if (stationListString) {
                var stationData = stationListString.split('\n');
                const stationListJson = stationData.map((station) => {
                    const stationArray = station.split(":");
                    return {
                        stationId: stationArray[0],
                        stationName: stationArray[1]
                    };
                })
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(stationListJson);
            } else {
                error = new Error('No station list data available');
                return next(error);
            }
        })
        .catch((error) => next(error));
}

export const startPianoBar = (callBack) => {
    //exec('bash /home/pi/Patiobar/scripts/pbstart.sh', callBack);
    exec('bash /h/Blankenship/github/audiopiServer/public/pbStart.sh', callBack)
}

export const stopPianoBar = (callBack) => {
    //exec('bash /home/pi/Patiobar/scripts/pbstop.sh', callBack);
    exec('bash /h/Blankenship/github/audiopiServer/public/pbStop.sh', callBack)
}