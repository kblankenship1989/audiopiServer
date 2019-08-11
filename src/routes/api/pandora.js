import { Router } from 'express';
import bodyParser from 'body-parser';

import { writeCommandToFifo, readStations, readCurrentSong } from '../../services/pianobar';
import { publishPandora } from '../sse'

export let pandoraState = {
    currentSong: {
        currentSong: {}
    },
    stationList: [],
    songHistory: []
};

const getInitialState = async () => {
    pandoraState.currentSong.currentSong = await readCurrentSong();
    pandoraState.stationList = await readStations();
};

getInitialState();

const pandoraRouter = Router();
pandoraRouter.use(bodyParser.json());

/* GET users listing. */
pandoraRouter.route('/')
    .get((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(pandoraState);
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
    .get((req, res, next) => {
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
    .get((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(pandoraState.songHistory.map((song, index) => ({ id: index, song })));
    });

pandoraRouter.route('/songs/current')
    .post(async (req, res, next) => {
        if (req.query.rating) {
            pandoraState.currentSong.currentSong.rating = req.query.rating;
            publishPandora(pandoraState);
        } else {
            try {
                pandoraState.currentSong.currentSong = await readCurrentSong();
                pandoraState.songHistory.unshift(currentSong);
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
