import { updateRelays } from "./relays";
import { startPlayback } from "./spotify";

export const startTimer = ({
    relays,
    contextUri,
    timeoutInMinutes,
    startSongIndex,
    shuffleState,
    volume
}) => {
    updateRelays(relays);

    startPlayback(contextUri, timeoutInMinutes, startSongIndex, shuffleState, volume);
};
