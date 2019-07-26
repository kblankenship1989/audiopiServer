import { Router } from 'express';
import bodyParser from 'body-parser';

import { writeCommandToFifo, stopPianoBar, startPianoBar } from '../../services/pianobar';
import { socketBroadcast } from '../../services/socketFunctions';

export var isPaused = false;
export var playerRunning = false;

var playerRouter = Router();
playerRouter.use(bodyParser.json());

/* GET users listing. */
playerRouter.route('/')
    .get(function (req, res, next) {
        let playerState = {
            playerRunning,
            isPaused
        };
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(playerState);
    })
    .post((req, res, next) => {
        let response;
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
            try {
                if (action === validCommands.STOPPLAYER) {
                    await stopPianoBar();
                    playerRunning = false;
                    isPaused = false;
                    socketBroadcast('player');
                    response = 'Successfully terminated PianoBar';
                } else if (action === validCommands.STARTPLAYER) {
                    await startPianoBar();
                    playerRunning = true;
                    isPaused = false;
                    socketBroadcast('player');
                    response = 'Successfully started PianoBar';
                } else {
                    await writeCommandToFifo(action);
                    if (action === validCommands.PLAYPAUSE) {
                        isPaused = !isPaused;
                        socketBroadcast('isPaused');
                    }
                    response = action + ' has been written successfully!';
                }
                res.status = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end(response);
            } catch (error) {
                next(error);
            }
        } else {
            var error = new Error('Invalid command: ' + req.query.command + ', please select from the following commands:\n' + Object.keys(validCommands).join('\n'));
            next(error);
        }
    });

export default playerRouter;