import { exec } from 'child_process';

export const setVolume = async (volumePercentage) => {
    await exec(`amixer set Digital ${volumePercentage}%`);
};

export const muteAll = async () => {
    await exec('amixer set Digital mute');
};

export const unMuteAll = async () => {
    await exec('amixer set Digital unmute');
};

export const toggleMute = async () => {
    await exec('amixer set Digital toggle')
}
