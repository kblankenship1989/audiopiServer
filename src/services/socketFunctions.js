import { wsApp } from '../app';

export const socketBroadcast = (source) => {
    const message = {
        updateOn: source
    };
    const clients = wsApp.getWss().clients;
    clients.forEach(client => {
        client.send(JSON.stringify(message));
    });
}