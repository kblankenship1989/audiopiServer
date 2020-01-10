import { getPlayerState, setPlayerState } from "../routes/api/player";
import { stopPianoBar, writeCommandToFifo } from "./pianobar";
import { publishPlayer } from "../routes/sse";
import { settings } from "./settings";

const getTimeout = () => settings.timeoutInMinutes * 60000;
const getCloseTimeout = () => settings.closeTimeoutInMinutes * 60000;

let timeoutCheck,
    timeoutClose;

const setPlayerPauseTimeout = () => {
    timeoutCheck = setTimeout(async () => {
        await writeCommandToFifo('p');
        const newPlayerState = getPlayerState();
        newPlayerState.playerTimedOut = true;
        newPlayerState.isPaused = true;
        newPlayerState.minutesRemaining = getCloseTimeout() / 60000;
        setPlayerState(newPlayerState);
        publishPlayer(newPlayerState);
        setPlayerCloseInterval();
    }, getTimeout())
};

const setPlayerCloseInterval = () => {
    timeoutClose = setInterval(() => {
        const newPlayerState = getPlayerState();
        const newMinutesRemaining = newPlayerState.minutesRemaining - 1;
        newPlayerState.minutesRemaining = newMinutesRemaining;
        if (newMinutesRemaining <= 0) {
            stopPianoBar();
            newPlayerState.playerTimedOut = false;
            newPlayerState.playerRunning = false;
        }
        setPlayerState(newPlayerState);
        publishPlayer(playerState);
    }, 60000)
};

export const clearPlayerTimeout = () => {
    clearTimeout(timeoutCheck);
    clearInterval(timeoutClose);
};

export const resetPlayerTimeout = () => {
    const newPlayerState = getPlayerState();
    newPlayerState.playerTimedOut = false;
    setPlayerState(newPlayerState);
    clearPlayerTimeout();
    setPlayerPauseTimeout();
};
