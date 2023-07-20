import { updateRelays } from "./relays";
import { startPlayback } from "./spotify";

export const startTimer = ({
    relays,
    contextUri,
    timeoutInMinutes
}) => {
    updateRelays(relays);

    startPlayback(contextUri, timeoutInMinutes);
};
