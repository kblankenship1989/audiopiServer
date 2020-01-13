import { Router } from 'express';
import bodyParser from 'body-parser';

import { writeCommandToFifo, readStations, readCurrentSong } from '../../services/pianobar';
import { publishPandora } from '../sse'

let pandoraState = {
    isLoading: true,
    currentSong: {
        currentSong: {}
    },
    stationList: [],
    songHistory: []
};

export const getPandoraState = () => pandoraState;

export const setPandoraState = (key, value) => {
    pandoraState[key] = value;
}

export const getInitialPandoraState = async () => {
    pandoraState.isLoading = true;
    pandoraState.currentSong.currentSong = await readCurrentSong();
    pandoraState.stationList = await readStations();
    pandoraState.songHistory = [
        pandoraState.currentSong.currentSong
    ];
    publishPandora(pandoraState);
};

const pandoraRouter = Router();
pandoraRouter.use(bodyParser.json());

/* GET users listing. */
pandoraRouter.route('/')
    .get((req, res) => {
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
        if (Object.keys(validCommands).includes(req.query.command)) {
            let action;

            action = validCommands[req.query.command];
            if (action === validCommands.SETSTATION) {
                action = `${action}${req.query.stationId.toString()}\n`;
                pandoraState.isLoading = true;
                publishPandora(pandoraState);
            } else if (action === validCommands.HATE) {
                pandoraState.isLoading = true;
                publishPandora(pandoraState);
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
            pandoraState.currentSong.currentSong.rating = req.query.rating;
            publishPandora(pandoraState);
        } else {
            try {
                pandoraState.currentSong.currentSong = await readCurrentSong();
                pandoraState.songHistory.unshift(pandoraState.currentSong.currentSong);
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
