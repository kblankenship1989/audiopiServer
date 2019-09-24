import { playerState } from "../routes/api/player";
import { stopPianoBar, writeCommandToFifo } from "./pianobar";
import { publishPlayer } from "../routes/sse";

const timeout = 60 * 60000;
const closeTimeout = 5 * 60000;

let timeoutCheck,
    timeoutClose;

const setPlayerPauseTimeout = () => {
    timeoutCheck = setTimeout(async () => {
        await writeCommandToFifo('p');
        playerState.playerTimedOut = true;
        playerState.isPaused = true;
        publishPlayer(playerState);
        setPlayerCloseTimeout();
    }, timeout)
};

const setPlayerCloseTimeout = () => {
    timeoutClose = setTimeout(() => {
        stopPianoBar();
    }, closeTimeout)
};

export const clearPlayerTimeout = () => {
    clearTimeout(timeoutCheck);
    clearTimeout(timeoutClose);
};

export const resetPlayerTimeout = () => {
    playerState.playerTimedOut = false;
    clearPlayerTimeout();
    setPlayerPauseTimeout();
};
