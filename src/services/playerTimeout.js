import { getPlayerState, setPlayerState } from "../routes/api/player";
import { stopPianoBar, writeCommandToFifo } from "./pianobar";
import { publishPlayer } from "../routes/sse";
import { getSettings } from "./settings";

const getTimeout = () => getSettings().timeoutInMinutes * 60000;
const getCloseTimeout = () => getSettings().closeTimeoutInMinutes * 60000;

let timeoutCheck,
    timeoutClose;

const setPlayerPauseTimeout = () => {
    timeoutCheck = setTimeout(async () => {
        await writeCommandToFifo('p');
        setPlayerState('playerTimedOut', true);
        setPlayerState('isPaused', true);
        setPlayerState('minutesRemaining', getCloseTimeout() / 60000);
        publishPlayer(getPlayerState());
        setPlayerCloseInterval();
    }, getTimeout())
};

const setPlayerCloseInterval = () => {
    timeoutClose = setInterval(() => {
        const newMinutesRemaining = getPlayerState().minutesRemaining - 1;
        setPlayerState('minutesRemaining', newMinutesRemaining);
        if (newMinutesRemaining <= 0) {
            stopPianoBar();
            setPlayerState('playerTimedOut', false);
            setPlayerState('playerRunning', false);
        
        }
        publishPlayer(getPlayerState);
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
