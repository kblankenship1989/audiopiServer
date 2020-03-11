import { Router } from 'express';
import bodyParser from 'body-parser';

import { readStations, readCurrentSong, getPandoraState, setPandoraState } from '../../services/pianobar';
import { publishPandora } from '../sse';
import { HATE, SETSTATION, pandoraCommands } from '../../literals/pandoraLiterals';
import { writeAction } from '../../services/player';

const pandoraRouter = Router();
pandoraRouter.use(bodyParser.json());

pandoraRouter.route('/')
    .get((req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(getPandoraState());
    })
    .post(async (req, res, next) => {
        const setPandoraLoading = async (action) => {
            setPandoraState({
                isLoading: true
            }, true);
            await writeAction(action);
        };

        const commandMap = {
            [HATE]: setPandoraLoading,
            [SETSTATION]: setPandoraLoading
        };

        if (Object.keys(pandoraCommands).includes(req.query.command)) {
            let action = pandoraCommands[req.query.command];

            if ('stationId' in req.query) {
                action = `${action}${req.query.stationId.toString()}\n`;
            }

            try {
                const response = action.charAt(0) in commandMap ? await commandMap[action.charAt(0)](action) : await writeAction(action);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end(response);
            } catch (error) {
                next(error);
            }
        } else {
            var err = new Error('Invalid command: ' + req.query.command + ', please select from the following commands:\n' + Object.keys(validCommands).join('\n'));
            return next(err);
        }
    });

pandoraRouter.route('/stations')
    .get((req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(pandoraState.stationList);
    })
    .post(async (req, res, next) => {
        try {
            pandoraState.stationList = await readStations();
            publishPandora(pandoraState);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(pandoraState.stationList);
        } catch (error) {
            next(error);
        }
    });

pandoraRouter.route('/songs')
    .get((req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(pandoraState.songHistory.map((song, index) => ({ id: index, song })));
    });

pandoraRouter.route('/songs/current')
    .post(async (req, res, next) => {
        pandoraState.isLoading = false;
        if (req.query.rating) {
            pandoraState.currentSong.rating = req.query.rating;
            publishPandora(pandoraState);
        } else {
            try {
                pandoraState.currentSong = await readCurrentSong();
                pandoraState.songHistory.unshift(pandoraState.currentSong);
                pandoraState.songHistory = pandoraState.songHistory.slice(0, 5);
                publishPandora(pandoraState);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('song added to history');
            } catch (error) {
                next(error);
            }
        }
    })
export default pandoraRouter;
