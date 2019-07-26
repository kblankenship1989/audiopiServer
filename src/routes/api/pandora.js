import { Router } from 'express';
import bodyParser from 'body-parser';

import { writeCommandToFifo, readStations, readCurrentSong } from '../../services/pianobar';
import { socketBroadcast } from '../../services/socketFunctions';

var pandoraRouter = Router();
pandoraRouter.use(bodyParser.json());

/* GET users listing. */
pandoraRouter.route('/')
    .get((req, res, next) => {
        let pandoraState = {};
        try {
            pandoraState.currentSong = await readCurrentSong();
            pandoraState.stationList = await readStations();
            pandoraState.currentStation = pandoraState.stationList.find(station => station.stationName == pandoraState.currentSong.stationName);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(pandoraState);
        } catch (error) {
            next(error);
        }
    })
    .post((req, res, next) => {
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
                } else if (req.query.command === 'SETSTATION') {
                    socketBroadcast('station');
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
    .get((req, res, next) => {
        let stations = {};
        readCurrentSong()
            .then((currentSong, error) => {
                if (error) {
                    return next(error);
                }
                const currentSongString = currentSong.toString();
                if (currentSongString) {
                    var songData = currentSongString.split(',,,');
                    const currentSongJson = {
                        artist: songData[0],
                        title: songData[1],
                        album: songData[2],
                        coverArt: songData[3],
                        rating: songData[4],
                        stationName: songData[5]
                    };
                    readStations()
                        .then((stationList, error) => {
                            if (error) {
                                return next(error);
                            }

                            const stationListString = stationList.toString();
                            if (stationListString) {
                                var stationData = stationListString.split('\n');
                                const stationListJson = stationData.map((station) => {
                                    const stationArray = station.split(":");
                                    return {
                                        stationId: stationArray[0],
                                        stationName: stationArray[1].replace('\r', '')
                                    };
                                });
                                stations.stationList = stationListJson;
                                stations.currentStation = stationListJson.find(station => station.stationName == currentSongJson.stationName)

                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(stations);
                            } else {
                                error = new Error('No station list data available');
                                return next(error);
                            }
                        })
                        .catch((error) => next(error));
                } else {
                    error = new Error('No current song data available');
                    return next(error);
                }
            })
            .catch(error => next(error));
    });

pandoraRouter('/songs')
    .get((req, res, next) => {
        res.send('returns list of all songs in database');
    });

pandoraRouter.route('songs/current')
    .post((req, res, next) => {
        socketBroadcast('currentSong');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('successfully sent to all clients!');
    })
export default pandoraRouter;