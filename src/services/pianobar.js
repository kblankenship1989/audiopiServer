import fs from 'fs';
import { exec } from 'child_process';
import { playerRunning } from '../routes/api/player'

var fifo = process.env.HOME + '/.config/pianobar/ctl';

export const writeCommandToFifo = async (action) => {
    let error;

    if (!playerRunning) {
        error = new Error('No player currently running.  Start player before sending commands.');
        throw error;
    }
    const fileHandle = await fs.promises.open(fifo, 'w', 0o644);
    console.log('Fifo opened');

    var buf = new Buffer.from(action);

    const written = await fileHandle.write(buf, 0, action.length, null);
    if (written.bytesWritten == action.length) {
        return written;
    } else {
        error = new Error('Error: Only wrote ' + written.bytesWritten + ' out of ' + action.length + ' bytes to fifo. \n Wrote: ' + written.buffer);
        throw error;
    }
}

export const readCurrentSong = async () => {
    const path = process.env.HOME + '/audiopiServer/public/currentSong';
    const fileHandle = await fs.promises.open(path, 'r');
    console.log('reading current song')
    const currentSong = await fileHandle.readFile();
    const currentSongString = currentSong.toString();
    if (currentSongString) {
        var songData = currentSongString.split(',,,');
        return {
            artist: songData[0],
            title: songData[1],
            album: songData[2],
            coverArt: songData[3],
            rating: songData[4],
            stationName: songData[5]
        };
    }
    let error = new Error('No current song data available.');
    throw error;
};

export const readStations = async () => {
    const path = process.env.HOME + '/audiopiServer/public/stationList';
    const fileHandle = await fs.promises.open(path, 'r')
    console.log('reading station list')
    const stationList = await fileHandle.readFile();
    const stationListString = stationList.toString();
    if (stationListString) {
        const stationData = stationListString.split('\n');
        return stationData.filter((station) => station.includes(':')).map((station) => {
            const stationArray = station.split(":");
            return {
                stationId: stationArray[0],
                stationName: stationArray[1].replace('\r', '')
            };
        });
    }
    let error = new Error('No station data available.');
    throw error;
};    

export const startPianoBar = async () => {
    const path = process.env.HOME + '/audiopiServer/public/pbStart.sh'
    await exec('bash ' + path);
}

export const stopPianoBar = async () => {
    const path = process.env.HOME + '/audiopiServer/public/pbStop.sh'
    await exec('bash ' + path);
}
