import { playerState } from "../routes/api/player";
import { stopPianoBar, writeCommandToFifo } from "./pianobar";
import { publishPlayer } from "../routes/sse";

const timeout = 120 * 60000;
const closeTimeout = 15 * 60000;

let timeoutCheck,
    timeoutClose;

const setPlayerPauseTimeout = () => {
    console.log('setting player timeout');
    timeoutCheck = setTimeout(async () => {
        console.log('auto pausing player');
        await writeCommandToFifo('p');
        playerState.playerTimedOut = true;
        playerState.isPaused = true;
        publishPlayer(playerState);
        setPlayerCloseTimeout();
    }, timeout)
};

const setPlayerCloseTimeout = () => {
    console.log('setting close timeout');
    timeoutClose = setTimeout(() => {
        console.log('closing player');
        stopPianoBar();
    }, closeTimeout)
};

export const clearPlayerTimeout = () => {
    console.log('clearing timeouts');
    clearTimeout(timeoutCheck);
    clearTimeout(timeoutClose);
};

export const resetPlayerTimeout = () => {
    console.log('resetting player timeouts');
    playerState.playerTimedOut = false;
    clearPlayerTimeout();
    setPlayerPauseTimeout();
};
