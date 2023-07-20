import {scheduleJob} from 'node-schedule';
import {v4} from 'uuid';

import { getSettings, updateSetting } from './settings';
import { updateRelays } from './relays';
import { startPlayback } from './spotify';

const alarmJobs = {};

export const startAlarmPlayback = async (alarmId) => {
    const {alarms, timeoutInMinutes} = getSettings();
    const alarm = alarms.find((alarm) => alarm.alarmId === alarmId);

    updateRelays(alarm.relays);

    return await startPlayback(alarm.contextUri, alarm.timeoutInMinutes || timeoutInMinutes);
};

export const getNextAlarm = (alarmId) => {
    return alarmJobs[alarmId].nextInvocation();
}

export const removeAlarm = (alarmId) => {
    alarmJobs[alarmId].cancel();

    const currentAlarms = getSettings().alarms;

    const updatedAlarms = currentAlarms.filter((alarm) => alarm.alarmId !== alarmId)

    updateSetting('alarms', updatedAlarms);

    return updatedAlarms;
};

const getSchedule = (alarm) => {
    return `${alarm.minute} ${alarm.hour} * * ${alarm.dayOfWeek}`;
};

export const addAlarm = (alarmSettings) => {
    const newAlarm = {
        ...alarmSettings,
        alarmId: v4()
    };

    const currentAlarms = getSettings().alarms;

    currentAlarms.push(newAlarm);

    updateSetting('alarms', currentAlarms);

    if (newAlarm.isEnabled) {
        const schedule = getSchedule(newAlarm);
        alarmJobs[newAlarm.alarmId] = scheduleJob(newAlarm.name, schedule, () => startAlarmPlayback(newAlarm.alarmId));
        return getNextAlarm(newAlarm.alarmId);
    }
};

export const updateAlarm = (alarmId, updatedAlarm) => {
    const currentAlarms = getSettings().alarms; 

    const newAlarms = currentAlarms.map((alarm) => {
        if (alarm.alarmId == alarmId) {
            return {
                ...alarm,
                ...updatedAlarm
            };
        }

        return alarm;
    })

    updateSetting('alarms', newAlarms);

    const alarm = newAlarms.find((alarm) => alarm.alarmId === alarmId);

    if (alarmJobs[alarmId]) {
        alarmJobs[alarmId].cancel();
    }

    if (alarm.isEnabled) {
        const schedule = getSchedule(alarm);
        alarmJobs[alarmId].reschedule(schedule);
        return getNextAlarm(alarm.alarmId);
    }
};

export const getAlarms = () => {
    const alarms = getSettings().alarms;

    return alarms.map((alarm) => ({
        ...alarm,
        nextActivation: getNextAlarm(alarm.alarmId)
    }));
};

export const initializeAlarms = (alarms) => {

    alarms.forEach((alarm) => {
        const schedule = getSchedule(alarm);
        alarmJobs[alarm.alarmId] = scheduleJob(alarm.name, schedule, () => startAlarmPlayback(alarm.alarmId));
    });
};

export const cancelNextRun = (alarmId) => {
    if (alarmJobs[alarmId]) {
        alarmJobs[alarmId].cancelNext();
        return getNextAlarm(alarmId);
    } else {
        console.log('Failed to cancel next job for alarm ID: ' + alarmId);
        return '';
    }
}
