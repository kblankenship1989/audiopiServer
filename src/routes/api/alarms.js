import {
    Router
} from 'express';
import {
    getAlarms,
    addAlarm,
    removeAlarm,
    getNextAlarm
} from '../../services/alarms';

const alarmsRouter = Router();

/* GET users listing. */
alarmsRouter.get('/', function (req, res) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(getAlarms());
    })
    .get('/:alarmId', function (req, res) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(getNextAlarm(req.params.alarmId));
    })
    .post('/', function (req, res) {
        const newAlarm = req.body;
        const nextAlarmActive = addAlarm(newAlarm);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(nextAlarmActive);
    })
    .put('/:alarmId', function (req, res) {
        const updatedAlarmId = req.params.alarmId;
        const updatedSettings = req.body;
        const nextAlarmActive = addAlarm(updatedAlarmId, updatedSettings);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(nextAlarmActive);
    })
    .delete('/:alarmId', function (req, res) {
        const deletedAlarmId = req.params.alarmId;
        removeAlarm(deletedAlarmId);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(getAlarms());
    });

export default alarmsRouter;