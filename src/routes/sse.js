import { EventEmitter } from 'eventemitter3';
import { playerState } from './api/player';
import { pandoraState } from './api/pandora';

const emitter = new EventEmitter();

export const subscribe = (req, res, next) => {
    let id = 0;

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    const nln = function() {
		res.write('\n');
    };
    
    const hbt = setInterval(nln, 15000);
    
    const onPlayer = function(data) {
        id += 1
		res.write('retry: 500\n');
		res.write(`event: player\n`);
		res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    const onPandora = function(data) {
        id += 1
		res.write('retry: 500\n');
		res.write(`event: pandora\n`);
		res.write(`data: ${JSON.stringify(data)}\n\n`);
    };
    
    if (id === 0) {
        onPlayer(playerState);
        onPandora(pandoraState);
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
    emmiter.emit('player', eventData);
};
