import { EventEmitter } from 'eventemitter3';
import { playerState } from './api/player';
import { pandoraState } from './api/pandora';

const emitter = new EventEmitter();

export const subscribe = (req, res, next) => {
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
    
    const onPlayer = function(data) {
        id += 1
		res.write('retry: 500\n');
		res.write('event: player\n');
		res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    const onPandora = function(data) {
        id += 1
		res.write('retry: 500\n');
		res.write('event: pandora\n');
		res.write(`data: ${JSON.stringify(data)}\n\n`);
    };
    
    if (id === 0) {
        setTimeout(() => {
            onPlayer(playerState);
            onPandora(pandoraState);
        }, 500);
    }
    
    emitter.on('player', onPlayer);
    emitter.on('pandora', onPandora);

	// Clear heartbeat and listener
	req.on('close', function() {
		clearInterval(hbt);
        emitter.removeListener('player', onPlayer);
        emitter.removeListener('pandora', onPandora);
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
