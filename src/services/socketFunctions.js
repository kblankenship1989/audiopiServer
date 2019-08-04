import { wsApp } from '../app';

export const socketBroadcast = (updateOn) => {
    const message = {
        updateOn
    };
    const clients = wsApp.getWss().clients;
    clients.forEach(client => {
        client.send(JSON.stringify(message));
    });
}