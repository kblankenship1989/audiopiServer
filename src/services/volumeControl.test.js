import childProcesses from 'child_process';

import {
    setVolume,
    muteAll,
    unMuteAll,
    toggleMute
} from './volumeControl';

describe('Volume controls => ', () => {
    let execSpy;
    
    beforeEach(() => {
        execSpy = jest.spyOn(childProcesses, 'exec');
    });

    afterEach(() => {
        jest.resetAllMocks();
    })
    test('Calling setVolume should set the specified volume', async () => {
        await setVolume(50);
        expect(execSpy).toHaveBeenCalledWith('amixer set Digital 50%');
    });

    test('Calling muteAll should mute the volume', async () => {
        await muteAll();
        expect(execSpy).toHaveBeenCalledWith('amixer set Digital mute');
    });

    test('Calling unMuteAll should unmute the volume', async () => {
        await unMuteAll();
        expect(execSpy).toHaveBeenCalledWith('amixer set Digital unmute');
    });

    test('Calling toggleMute should toggle the mute setting', async () => {
        await toggleMute(50);
        expect(execSpy).toHaveBeenCalledWith('amixer set Digital toggle');
    });
});
