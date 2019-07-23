import { Router } from 'express';
import bodyParser from 'body-parser';
import { readStations } from '../../services/pianobar';

var pandoraRouter = Router();
pandoraRouter.use(bodyParser.json());

/* GET users listing. */
pandoraRouter.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

pandoraRouter.post('/', (req, res, next) => {
  const validCommands = {
      LOVE: '+',
      HATE: '-',
      SETSTATION: 's'
  }
  console.log('Got command ' + req.query.command);
  if (Object.keys(validCommands).includes(req.query.command)) {
      console.log('Starting write to file');
      const action = validCommands[req.query.command];
      if (action === validCommands.SETSTATION){
          
      
      if (!playerRunning) {
          var error = new Error('No player currently running.  Please start player and try again')
          return next(error);
      }
      
      writeCommandToFifo(action)
          .then((written, error) => {
              if (error) {
                  return next(error);
              }
              if (written.bytesWritten == action.length) {
                  if (action === validCommands.PLAYPAUSE) {
                      isPaused = !isPaused;
                  }
                  socketBroadcast('player');
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'text/plain');
                  res.end(action + ' has been written successfully!');
                  
              } else {
                  error = new Error('Error: Only wrote ' + written.bytesWritten + ' out of ' + action.length + ' bytes to fifo. \n Wrote: ' + written.buffer);
                  return next(error);
              }
          })
          .catch(error => next(error));
  } else {
      var err = new Error('Invalid command: ' + req.query.command +', please select from the following commands:\n' + Object.keys(validCommands).join('\n'));
      return next(err);
  }
});

pandoraRouter.get('/stations', (req, res, next) => {
  readStations(req, res, next);
})

export default pandoraRouter;