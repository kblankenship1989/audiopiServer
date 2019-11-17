import { playerState } from "../routes/api/player";
import { stopPianoBar, writeCommandToFifo } from "./pianobar";
import { publishPlayer } from "../routes/sse";

const timeout = 120 * 60000;
const closeTimeout = 15 * 30000;

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
        if (newMinutesRemaining === 0) {
            stopPianoBar();
        } else {
            playerState.minutesRemaining = newMinutesRemaining;
            publishPlayer(playerState);
        }
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
