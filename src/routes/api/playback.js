import {
    Router
} from 'express';
import { getDeviceId, getPlaylists, startPlayback } from '../../services/spotify';

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
    .post('/:contextUri', function (req, res) {
        startPlayback(null, null, req.params.contextUri);
        res.statusCode = 200;
    });

export default playbackRouter;