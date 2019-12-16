import { Router } from 'express';

var relayRouter = Router();

/* GET users listing. */
relayRouter.get('/', function(req, res, next) {
  res.send('respond with relay statuses');
});

export default relayRouter;