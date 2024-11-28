import {
    Router
} from 'express';
import { startTimer } from '../../services/timer';

const timerRouter = Router();

/* GET users listing. */
timerRouter.post('/', function (req, res) {
        const timerSettings = req.body;
        startTimer(timerSettings);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
    });

export default timerRouter;