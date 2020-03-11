import { stopPianoBar, writeCommandToFifo } from "./pianobar";
import { getSettings } from "./settings";
import { updateRelays } from "./relays";
import { setPlayerState, getPlayerState } from "./player";

const getTimeout = () => getSettings().timeoutInMinutes * 60000;
const getCloseTimeout = () => getSettings().closeTimeoutInMinutes * 60000;

let timeoutCheck,
    timeoutClose;

const closePianobar = () => {
    stopPianoBar();
    setPlayerState({
        playerTimedOut: false,
        playerRunning: false
    });
    if (getSettings().relays.alarmOverride) {
        const relaySettings = getSettings().relays;
        relaySettings.alarmOverride = false;
        updateRelays(relaySettings);
    }
}

const setPlayerCloseInterval = () => {
    timeoutClose = setInterval(() => {
        const newMinutesRemaining = getPlayerState().minutesRemaining - 1;
        if (newMinutesRemaining <= 0) {
            closePianobar();
        } else {
            setPlayerState({
                minutesRemaining: newMinutesRemaining
            });
        }
    }, 60000)
};

const setPlayerPauseTimeout = () => {
    timeoutCheck = setTimeout(async () => {
        await writeCommandToFifo('p');
        setPlayerState({
            playerTimedOut: true,
            isPaused: true,
            minutesRemaining: getCloseTimeout() / 60000
        });
        setPlayerCloseInterval();
    }, getTimeout())
};

export const clearPlayerTimeout = () => {
    clearTimeout(timeoutCheck);
    clearInterval(timeoutClose);
};

export const resetPlayerTimeout = () => {
    setPlayerState({playerTimedOut: false});
    clearPlayerTimeout();
    setPlayerPauseTimeout();
};
