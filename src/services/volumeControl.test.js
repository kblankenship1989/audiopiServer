import childProcesses from 'child_process';

import {
    setVolume,
    muteAll,
    unMuteAll,
    toggleMute
} from './volumeControl';

test('Calling setVolume should set the specified volume', async () => {
    const execSpy = jest.spyOn(childProcesses, 'exec');
    await setVolume(50);
    expect(execSpy).toHaveBeenCalledWith('amixer set Digital 50%');
})