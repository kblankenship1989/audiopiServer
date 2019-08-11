import { Router } from 'express';
import bodyParser from 'body-parser';
import * as findProcess from 'find-process';

import { writeCommandToFifo, stopPianoBar, startPianoBar } from '../../services/pianobar';
import { publishPlayer } from '../sse';

export let playerState = {
    playerRunning: false,
    isPaused: false
}

setInterval(() => {
	findProcess.default('name','pianobar')
		.then((list) => {
			const pianobarFound = !!list.length;
			if (pianobarFound != playerState.playerRunning){
				playerState.playerRunning = pianobarFound;
				publishPlayer(playerState);
			};
		});
},5000);

var playerRouter = Router();
playerRouter.use(bodyParser.json());

/* GET users listing. */
playerRouter.route('/')
    .get((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(playerState);
    })
    .post(async (req, res, next) => {
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
                    playerState.playerRunning = false;
                    playerState.isPaused = false;
                    publishPlayer(playerState);
                    response = 'Successfully terminated PianoBar';
                } else if (action === validCommands.STARTPLAYER) {
                    await startPianoBar();
                    playerState.playerRunning = true;
                    playerState.isPaused = false;
                    publishPlayer(playerState);
                    response = 'Successfully started PianoBar';
                } else {
                    await writeCommandToFifo(action);
                    if (action === validCommands.PLAYPAUSE) {
                        playerState.isPaused = !isPaused;
                        publishPlayer(playerState);
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
