import {
    Router
} from 'express';
import {
    getAlarms,
    addAlarm,
    removeAlarm,
    getNextAlarm,
    updateAlarm,
    startAlarmPlayback,
    cancelNextRun
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
        const nextAlarmActive = updateAlarm(updatedAlarmId, updatedSettings);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(nextAlarmActive);
    })
    .put('/:alarmId/test', function (req, res) {
        const startSuccessful = startAlarmPlayback(req.params.alarmId);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({startSuccessful})
    })
    .put('/:alarmId/cancelNext', function (req, res) {
        const nextInvocation = cancelNextRun(req.params.alarmId);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({nextInvocation})
    })
    .delete('/:alarmId', function (req, res) {
        const deletedAlarmId = req.params.alarmId;
        removeAlarm(deletedAlarmId);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(getAlarms());
    });

export default alarmsRouter;