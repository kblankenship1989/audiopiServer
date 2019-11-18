import { playerState } from "../routes/api/player";
import { stopPianoBar, writeCommandToFifo } from "./pianobar";
import { publishPlayer } from "../routes/sse";

const timeout = 120 * 60000;
const closeTimeout = 15 * 60000;

let timeoutCheck,
    timeoutClose;

const setPlayerPauseTimeout = () => {
    timeoutCheck = setTimeout(async () => {
        await writeCommandToFifo('p');
        playerState.playerTimedOut = true;
        playerState.isPaused = true;
        playerState.minutesRemaining = closeTimeout / 60000;
        publishPlayer(playerState);
        setPlayerCloseInterval();
    }, timeout)
};

const setPlayerCloseInterval = () => {
    timeoutClose = setInterval(() => {
        const newMinutesRemaining = playerState.minutesRemaining - 1;
        playerState.minutesRemaining = newMinutesRemaining;
        if (newMinutesRemaining <= 0) {
            stopPianoBar();
            playerState.playerTimedOut = false;
        }
        publishPlayer(playerState);
    }, 60000)
};

export const clearPlayerTimeout = () => {
    clearTimeout(timeoutCheck);
    clearInterval(timeoutClose);
};

export const resetPlayerTimeout = () => {
    playerState.playerTimedOut = false;
    clearPlayerTimeout();
    setPlayerPauseTimeout();
};
