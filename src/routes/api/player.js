import { Router } from 'express';
import bodyParser from 'body-parser';
import * as findProcess from 'find-process';

import { writeCommandToFifo, stopPianoBar, startPianoBar } from '../../services/pianobar';
import { publishPlayer, publishPandora } from '../sse';
import { resetPlayerTimeout, clearPlayerTimeout } from '../../services/playerTimeout';
import { getInitialPandoraState, getPandoraState, setPandoraState} from './pandora';

let playerState = {
    isPaused: false,
    minutesRemaining: 0,
    playerRunning: false,
    playerTimedOut: false
};

export const getPlayerState = () => playerState;

export const setPlayerState = (key, value) => {
    playerState[key] = value;
}

setInterval(() => {
	findProcess.default('name','pianobar')
		.then((list) => {
			const pianobarFound = !!list.length;
			if (pianobarFound != playerState.playerRunning){
				playerState.playerRunning = pianobarFound;
				publishPlayer(playerState);
			}
		});
},5000);

var playerRouter = Router();
playerRouter.use(bodyParser.json());

/* GET users listing. */
playerRouter.route('/')
    .get((req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(playerState);
    })
    .post(async (req, res, next) => {
        let action, 
            response;
        const validCommands = {
            VOLUME_UP: ')',
            VOLUME_DOWN: '(',
            PLAYPAUSE: 'p',
            NEXT: 'n',
            REPLAY: 'h',
            STOPPLAYER: 'STOPPLAYER',
            STARTPLAYER: 'STARTPLAYER'
        }
        console.log('Got command ' + req.query.command);
        if (Object.keys(validCommands).includes(req.query.command)) {
            console.log('Starting write to file');
            action = validCommands[req.query.command];
            try {
                if (action === validCommands.STOPPLAYER) {
                    await stopPianoBar();
                    playerState.playerRunning = false;
                    playerState.isPaused = false;
                    playerState.playerTimedOut = false;
                    clearPlayerTimeout();
                    publishPlayer(playerState);
                    response = 'Successfully terminated PianoBar';
                } else if (action === validCommands.STARTPLAYER) {
                    await startPianoBar();
                    getInitialPandoraState();
                    playerState.playerRunning = true;
                    playerState.isPaused = false;
                    playerState.playerTimedOut = false;
                    resetPlayerTimeout();
                    publishPlayer(playerState);
                    response = 'Successfully started PianoBar';
                } else {
                    if (action === validCommands.REPLAY) {
                        action = `${action}${req.query.songIndex.toString()}\n`;
                        setPandoraState('isLoading', true);
                        publishPandora(getPandoraState);
                    } else if (action === validCommands.NEXT) {
                        setPandoraState('isLoading', true);
                        publishPandora(getPandoraState);
                    }
                    await writeCommandToFifo(action);
                    if (action === validCommands.PLAYPAUSE) {
                        playerState.isPaused = !playerState.isPaused;
                        playerState.playerTimedOut = false;
                    }
                    resetPlayerTimeout();
                    publishPlayer(playerState);
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
