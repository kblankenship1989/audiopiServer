import {scheduleJob} from 'node-schedule';
import {v4} from 'uuid';

import { startPianoBar } from './pianobar';
import { getPlayerState } from '../routes/api/player';
import { getSettings, updateSetting } from './settings';

const alarmJobs = {};

const startPianoBarCallback = () => {
    if (!getPlayerState().playerRunning) {
        startPianoBar();
    }
};

export const getNextAlarm = (alarmId) => {
    return alarmJobs[alarmId].nextInvocation();
}

export const removeAlarm = (alarmId) => {
    console.log('removing alarm: ', alarmId)
    alarmJobs[alarmId].cancel();

    const currentAlarms = getSettings().alarms;

    const updatedAlarms = currentAlarms.filter((alarm) => alarm.id !== alarmId)

    updateSetting('alarms', updatedAlarms);

    return updatedAlarms;
};

const getSchedule = (alarm) => {
    return `${alarm.minute} ${alarm.hour} * * ${alarm.dayOfWeek}`;
};

export const addAlarm = (alarmSettings) => {
    console.log('adding alarm: ', alarmSettings);
    const newAlarm = {
        ...alarmSettings,
        id: v4()
    };

    const currentAlarms = getSettings().alarms;

    currentAlarms.push(newAlarm);

    updateSetting('alarms', currentAlarms);

    if (newAlarm.isEnabled) {
        const schedule = getSchedule(newAlarm);
        alarmJobs[newAlarm.id] = scheduleJob(newAlarm.name, schedule, startPianoBarCallback);
        return getNextAlarm(newAlarm.id);
    }
};

export const updateAlarm = (alarmId, updatedAlarm) => {
    console.log('updating alarm: ', alarmId, updatedAlarm);
    const currentAlarms = getSettings().alarms; 

    const newAlarms = currentAlarms.map((alarm) => {
        if (alarm.id == alarmId) {
            return updatedAlarm;
        }

        return alarm;
    })

    updateSetting('alarms', newAlarms);


    if (updatedAlarm.isEnabled) {
        const schedule = getSchedule(updatedAlarm);
        alarmJobs[alarmId].reschedule(schedule);
        return getNextAlarm(updatedAlarm.id);
    }

    removeAlarm(updatedAlarm.id);
};

export const getAlarms = () => {
    const alarms = getSettings().alarms;

    return alarms.map((alarm) => ({
        ...alarm,
        nextActivation: getNextAlarm(alarm.id)
    }));
};

export const initializeAlarms = () => {
    const alarms = getSettings().alarms;

    alarms.forEach((alarm) => {
        const schedule = getSchedule(alarm);
        alarmJobs[alarm.id] = scheduleJob(alarm.name, schedule, startPianoBarCallback);
    });
};
