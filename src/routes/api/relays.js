import { Router } from 'express';
import { updateRelays, getRelayState } from '../../services/relays';
import { publishRelays } from '../sse';
import { getSettings } from '../../services/settings';

var relayRouter = Router();

/* GET users listing. */
relayRouter.get('/', function(req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(getRelayState());
})
.post('/', function(req, res) {
    const relayMapping = {
        FIRST: 'firstFloorRelayState',
        SECOND: 'secondFloorRelayState',
        ALARM: 'alarmOverride'
    }

    const newRelayState = getSettings().relays;

    let value;

    if (req.query.key === 'ALARM') {
        value = false;
    } else {
        value = req.query.value;
    }

    newRelayState[relayMapping[req.query.key]] = value;

    updateRelays(newRelayState, () => {
        publishRelays(getRelayState());
        res.status = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`Successfully updated KEY: ${req.query.key}`);
    });
});

export default relayRouter;