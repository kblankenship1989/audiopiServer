import { Router } from 'express';
import bodyParser from 'body-parser';

import { writeCommandToFifo, stopPianoBar, readCurrentSong, startPianoBar } from '../../services/pianobar';
import { socketBroadcast } from '../../services/socketFunctions';

export var isPaused = false;
export var playerRunning = false;

var playerRouter = Router();
playerRouter.use(bodyParser.json());

/* GET users listing. */
playerRouter.get('/', function (req, res, next) {
    let playerState = {
        playerRunning,
        isPaused
    };
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(playerState);
});

playerRouter.post('/', (req, res, next) => {
    const validCommands = {
        VOLUME_UP: ')',
        VOLUME_DOWN: '(',
        PLAYPAUSE: 'p',
        NEXT: 'n',
        STOPPLAYER: 'STOPPLAYER',
        STARTPLAYER: 'STARTPLAYER'
    }
    console.log('Got command ' + req.query.command);
    if (Object.keys(validCommands).includes(req.query.command)) {
        console.log('Starting write to file');
        const action = validCommands[req.query.command];
        if (action === validCommands.STOPPLAYER) {
            stopPianoBar((error, stdout, stderr) => {
                if (error) {
                    return next(error);
                }
                playerRunning = false;
                isPaused = false;
                socketBroadcast('player');
                res.status = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Successfully terminated PianoBar');
            });
        } else if (action === validCommands.STARTPLAYER) {
            startPianoBar((error, stdout, stderr) => {
                if (error) {
                    return next(error);
                }
                playerRunning = true;
                isPaused = false;
                socketBroadcast('player');
                res.status = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Successfully started PianoBar');
            });
        } else {
            if (!playerRunning) {
                var error = new Error('No player currently running.  Please start player and try again')
                return next(error);
            }

            writeCommandToFifo(action)
                .then((written, error) => {
                    if (error) {
                        return next(error);
                    }
                    if (written.bytesWritten == action.length) {
                        if (action === validCommands.PLAYPAUSE) {
                            isPaused = !isPaused;
                            socketBroadcast('isPaused');
                        }
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'text/plain');
                        res.end(action + ' has been written successfully!');

                    } else {
                        error = new Error('Error: Only wrote ' + written.bytesWritten + ' out of ' + action.length + ' bytes to fifo. \n Wrote: ' + written.buffer);
                        return next(error);
                    }
                })
                .catch(error => next(error));
        }
    } else {
        var err = new Error('Invalid command: ' + req.query.command + ', please select from the following commands:\n' + Object.keys(validCommands).join('\n'));
        return next(err);
    }
});

export default playerRouter;