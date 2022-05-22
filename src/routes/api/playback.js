import {
    Router
} from 'express';
import { getDeviceId, getPlaylists, pausePlayback, startPlayback } from '../../services/spotify';

const playbackRouter = Router();

/* GET users listing. */
playbackRouter.get('/device', async (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(await getDeviceId());
    }).get('/playlists', async (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(await getPlaylists());
    })
    .put('/start', function (req, res) {
        startPlayback(null, null, req.body.context_uri);
        res.statusCode = 200;
        res.send("Playback started")
    })
    .put('/pause', function (req, res) {
        pausePlayback();
        res.statusCode = 200;
        res.send("Playback puased")
    });

export default playbackRouter;