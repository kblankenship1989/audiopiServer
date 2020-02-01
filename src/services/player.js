import * as findProcess from 'find-process';
import { publishPlayer } from '../routes/sse';
import { stopPianoBar, startPianoBar, getInitialPandoraState, writeCommandToFifo } from './pianobar';
import { clearPlayerTimeout, resetPlayerTimeout } from './playerTimeout';

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

export const stopPlayer = async () => {
    await stopPianoBar();
    setPlayerState({
        playerRunning: false,
        isPaused: false,
        playerTimeout: false
    });
    clearPlayerTimeout();
    return 'Successfully terminated PianoBar';
};

export const startPlayer = async () => {
    await startPianoBar();
    getInitialPandoraState();
    setPlayerState({
        playerRunning: true,
        isPaused: false,
        playerTimedOut: false
    });
    resetPlayerTimeout();
    return 'Successfully started PianoBar';
};

export const writeAction = async (action) => {
    await writeCommandToFifo(action);
    resetPlayerTimeout();
    return action + ' has been written successfully!';
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
