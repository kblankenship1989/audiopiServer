import { EventEmitter } from 'eventemitter3';
import { getPlayerState } from './api/player';
import { pandoraState } from './api/pandora';
import { getRelayStates } from '../services/relays';

const emitter = new EventEmitter();

export const subscribe = (req, res) => {
    let id = 0;

    res.writeHead(200, {
        Connection: "keep-alive",
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache"
    });
    
    const nln = function() {
        res.write('\n');
    };
    
    const hbt = setInterval(nln, 15000);

    const onEvent = function(eventName, data) {
        id += 1
		res.write('retry: 500\n');
		res.write(`event: ${eventName}\n`);
		res.write(`data: ${JSON.stringify(data)}\n\n`);
    };
    
    const onPlayer = function(data) {
        return onEvent('player', data);
    };

    const onPandora = function(data) {
        return onEvent('pandora', data);
    };

    const onRelays = function(data) {
        return onEvent('relays', data);
    }

    if (id === 0) {
        setTimeout(() => {
            onPlayer(getPlayerState());
            onPandora(pandoraState);
            onRelays(getRelayStates());
        }, 500);
    }
    
    emitter.on('player', onPlayer);
    emitter.on('pandora', onPandora);
    emitter.on('relays', onRelays)

	// Clear heartbeat and listener
	req.on('close', function() {
		clearInterval(hbt);
        emitter.removeListener('player', onPlayer);
        emitter.removeListener('pandora', onPandora);
        emitter.removeListener('relays', onRelays)
	});
};

export const publishPandora = (eventData) => {
    emitter.emit('pandora', eventData);
};

export const publishPlayer = (eventData) => {
    emitter.emit('player', eventData);
};

export const publishRelays = (eventData) => {
    emitter.emit('relays', eventData);
}
