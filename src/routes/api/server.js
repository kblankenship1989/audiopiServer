import { Router } from 'express';
import { exec } from 'child_process';

var serverRouter = Router();

serverRouter.post('/restart', function(req, res) {
    res.status = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`Rebooting server`);

    exec('sudo reboot now');
});

export default serverRouter;