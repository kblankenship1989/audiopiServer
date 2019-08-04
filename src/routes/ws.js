import { Router } from 'express';
import expressWs from 'express-ws';
import { wsApp } from '../app';

export const wsRouter = Router();
expressWs(wsRouter);

wsRouter.ws('/', (ws, req) => {
    console.log(wsApp.getWss().clients);
    ws.on('message', (msg) => {
        console.log(msg);
    })
})