import * as findProcess from 'find-process';
import { publishPlayer } from '../routes/sse';

let playerState = {
    isPaused: false,
    minutesRemaining: 0,
    playerRunning: false,
    playerTimedOut: false
};

export const getPlayerState = () => playerState;

export const setPlayerState = (overrides, shouldPublish = true) => {
    playerState = {
        ...playerState,
        ...overrides
    };
    shouldPublish && publishPlayer(playerState);
};

export const stopPlayer = () => {
    await stopPianoBar();
    setPlayerState({
        playerRunning: false,
        isPaused: false,
        playerTimeout: false
    });
    clearPlayerTimeout();
    return 'Successfully terminated PianoBar';
};

export const startPlayer = () => {
    await startPianoBar();
    getInitialPandoraState();
    setPlayerState({
        playerRunning: true,
        isPaused: false,
        playerTimedOut: false
    });
    resetPlayerTimeout();
    return 'Successfully started PianoBar';
}

export const togglePaused = () => {
    
}

setInterval(() => {
	findProcess.default('name','pianobar')
		.then((list) => {
			const pianobarFound = !!list.length;
			if (pianobarFound != playerState.playerRunning){
				setPlayerState({
                    playerRunning: pianobarFound
                });
			}
		});
},5000);
