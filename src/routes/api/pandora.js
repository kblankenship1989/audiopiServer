import { Router } from 'express';
import bodyParser from 'body-parser';

import { writeCommandToFifo, readStations, readCurrentSong } from '../../services/pianobar';
import { socketBroadcast } from '../../services/socketFunctions';

export var songHistory = [];

var pandoraRouter = Router();
pandoraRouter.use(bodyParser.json());

/* GET users listing. */
pandoraRouter.route('/')
    .get(async (req, res, next) => {
        let pandoraState = {};
        try {
            pandoraState.currentSong = await readCurrentSong();
            pandoraState.stationList = await readStations();

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(pandoraState);
        } catch (error) {
            next(error);
        }
    })
    .post(async (req, res, next) => {
        const validCommands = {
            LOVE: '+',
            HATE: '-',
            SETSTATION: 's'
        }
        console.log('Got command ' + req.query.command);
        if (Object.keys(validCommands).includes(req.query.command)) {
            let action;

            console.log('Starting write to file');
            action = validCommands[req.query.command];
            if (action === validCommands.SETSTATION) {
                action += req.query.stationId.toString();
            }

            try {
                await writeCommandToFifo(action)

                if (action === validCommands.LOVE) {
                    socketBroadcast('rating');
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end(action + ' has been written successfully!');
            } catch (error) {
                next(error);
            }
        } else {
            var err = new Error('Invalid command: ' + req.query.command + ', please select from the following commands:\n' + Object.keys(validCommands).join('\n'));
            return next(err);
        }
    });

pandoraRouter.route('/stations')
    .get(async (req, res, next) => {
        let stationList = [];
        try {
            stationList = await readStations();

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(stationList);
        } catch (error) {
            next(error);
        }
    });

pandoraRouter.route('/songs')
    .get((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(songHistory.map((song, index) => ({ id: index, song })));
    });

pandoraRouter.route('songs/current')
    .post(async (req, res, next) => {
        try {
            const currentSong = await readCurrentSong();
            songHistory.unshift(currentSong).slice(0, 5);
            socketBroadcast('currentSong');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('song added to history');
        } catch (error) {
            next(error);
        }
    })
export default pandoraRouter;