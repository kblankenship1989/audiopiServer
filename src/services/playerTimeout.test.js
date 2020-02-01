import { stopPianoBar, writeCommandToFifo } from "./pianobar";
import { getSettings } from "./settings";
import { updateRelays } from "./relays";
import { setPlayerState, getPlayerState } from "./player";
import * as testModule from './playerTimeout';

jest.mock('./pianobar');
jest.mock('./settings');
jest.mock('./relays');
jest.mock('./player');
jest.useFakeTimers();

test("Should clear all timeouts", () => {
    testModule.clearPlayerTimeout();

    expect(clearTimeout).toHaveBeenCalledTimes(1);
    expect(clearInterval).toHaveBeenCalledTimes(1);
});

test("Should clear and reapply timeouts on reset", () => {
    jest.spyOn(testModule, '_setPlayerPauseTimeout');
    jest.spyOn(testModule, 'clearPlayerTimeout');

    getPlayerState.mockReturnValue({});

    testModule.resetPlayerTimeout();

    expect(setPlayerState).toHaveBeenCalledWith({playerTimedOut: false});
    expect(testModule.clearPlayerTimeout).toHaveBeenCalledTimes(1);
    expect(testModule._setPlayerPauseTimeout).toHaveBeenCalledTimes(1);
})