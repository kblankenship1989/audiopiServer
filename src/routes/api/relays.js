import { Router } from 'express';
import { setFirstFloor, setSecondFloor } from '../../services/relays';

var relayRouter = Router();

/* GET users listing. */
relayRouter.get('/', function(req, res, next) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(playerState);
})
.post('/', function(req, res, next) {
    const relayMapping = {
        FIRST: setFirstFloor,
        SECOND: setSecondFloor
    }

    const call = relayMapping[req.query.floor];

    if (call) {
        call(req.query.value, () => {
            res.status = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end(`Successfully updated FLOOR: ${req.query.floor} to VALUE: ${req.query.value}`);
        });
    } else {
        var error = new Error('Invalid floor: ' + req.query.floor + ', please select from the following floors:\n' + Object.keys(relayMapping).join('\n'));
        next(error);
    }
});

export default relayRouter;