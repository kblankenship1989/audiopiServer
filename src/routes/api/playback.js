import {
    Router
} from 'express';
import fetch from 'node-fetch';
import { getDeviceId, getPlaylists, startPlayback } from '../../services/spotify';

const playbackRouter = Router();

/* GET users listing. */
playbackRouter.get('/device', function(req, res) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(getDeviceId());
    }).get('/playlists', function(req, res) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(getPlaylists());
    })
    .post('/:contextUri', function (req, res) {
        startPlayback(null, null, req.params.contextUri);
        res.statusCode = 200;
    });

export default playbackRouter;