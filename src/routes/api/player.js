import { Router } from 'express';
import bodyParser from 'body-parser';

import { writeCommandToFifo} from '../../services/pianobar';
import { resetPlayerTimeout } from '../../services/playerTimeout';
import { setPandoraState} from './pandora';
import { getPlayerState, startPlayer, stopPlayer } from '../../services/player';


var playerRouter = Router();
playerRouter.use(bodyParser.json());

playerRouter.route('/')
    .get((req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(getPlayerState());
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
        };

        const writeAction = (action) => {
            await writeCommandToFifo(action);
            resetPlayerTimeout();
            return action + ' has been written successfully!';
        }

        const setPandoraLoading = (action) => {
            setPandoraState({
                isLoading: true
            });
            resetPlayerTimeout();
            writeAction(action);
        };

        const commandMap = {
            [validCommands.STOPPLAYER]: stopPlayer,
            [validCommands.STARTPLAYER]: startPlayer,
            [validCommands.NEXT]: setPandoraLoading,
            [validCommands.REPLAY]: setPandoraLoading
        };

        if (Object.keys(validCommands).includes(req.query.command)) {
            if (songIndex in req.query) {
                action = `${action}${req.query.songIndex.toString()}\n`;
            } else {
                action = validCommands[req.query.command];
            }

            try {
                response = action.charAt(0) in commandMap ? commandMap[action.charAt(0)](action) : writeAction(action);
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
