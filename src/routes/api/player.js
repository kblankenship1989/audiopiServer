import { Router } from 'express';
import bodyParser from 'body-parser';

import { setPandoraState} from './pandora';
import { getPlayerState, startPlayer, stopPlayer, writeAction } from '../../services/player';
import { STOPPLAYER, STARTPLAYER, NEXT, REPLAY, playerCommands } from '../../literals/playerLiterals';


var playerRouter = Router();
playerRouter.use(bodyParser.json());

playerRouter.route('/')
    .get((req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(getPlayerState());
    })
    .post(async (req, res, next) => {
        const setPandoraLoading = async (action) => {
            setPandoraState({
                isLoading: true
            });
            await writeAction(action);
        };

        const commandMap = {
            [STOPPLAYER]: stopPlayer,
            [STARTPLAYER]: startPlayer,
            [NEXT]: setPandoraLoading,
            [REPLAY]: setPandoraLoading
        };

        if (Object.keys(playerCommands).includes(req.query.command)) {
            let action = playerCommands[req.query.command];

            if ('songIndex' in req.query) {
                action = `${action}${req.query.songIndex.toString()}\n`;
            }

            try {
                const response = action.charAt(0) in commandMap ? await commandMap[action.charAt(0)](action) : await writeAction(action);
                res.status = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end(response);
            } catch (error) {
                next(error);
            }
        } else {
            var error = new Error('Invalid command: ' + req.query.command + ', please select from the following commands:\n' + Object.keys(playerCommands).join('\n'));
            next(error);
        }
    });

export default playerRouter;
