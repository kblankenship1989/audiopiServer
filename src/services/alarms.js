import {scheduleJob} from 'node-schedule';
import {v4} from 'uuid';

import { getSettings, updateSetting } from './settings';
import { updateRelays } from './relays';
import { getDeviceId, pausePlayback, startPlayback } from './spotify';
import { refreshAccessToken } from './token_helpers';

const alarmJobs = {};

const getTimeout = () => getSettings().timeoutInMinutes * 60000;

const setAlarmTimeout = (authToken, deviceId) => {
    setTimeout(async () => {
        pausePlayback(authToken, deviceId)
    }, getTimeout())
};

export const startAlarmPlayback = async (alarmId) => {
    const alarm = getSettings().alarms.find((alarm) => alarm.id = alarmId);

    updateRelays(alarm.relays);

    const authToken = await refreshAccessToken();
    const deviceId = await getDeviceId(authToken);
    setAlarmTimeout(authToken, deviceId);
    return await startPlayback(authToken, deviceId, alarm.contextUri)
};

export const getNextAlarm = (alarmId) => {
    return alarmJobs[alarmId].nextInvocation();
}

export const removeAlarm = (alarmId) => {
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
    const newAlarm = {
        ...alarmSettings,
        id: v4()
    };

    const currentAlarms = getSettings().alarms;

    currentAlarms.push(newAlarm);

    updateSetting('alarms', currentAlarms);

    if (newAlarm.isEnabled) {
        const schedule = getSchedule(newAlarm);
        alarmJobs[newAlarm.id] = scheduleJob(newAlarm.name, schedule, startAlarmPlayback);
        return getNextAlarm(newAlarm.id);
    }
};

export const updateAlarm = (alarmId, updatedAlarm) => {
    const currentAlarms = getSettings().alarms; 

    const newAlarms = currentAlarms.map((alarm) => {
        if (alarm.id == alarmId) {
            return {
                ...alarm,
                ...updatedAlarm
            };
        }

        return alarm;
    })

    updateSetting('alarms', newAlarms);

    const alarm = newAlarms.find((alarm) => alarm.id === alarmId);

    if (alarm.isEnabled) {
        const schedule = getSchedule(alarm);
        alarmJobs[alarmId].reschedule(schedule);
        return getNextAlarm(alarm.id);
    }
};

export const getAlarms = () => {
    const alarms = getSettings().alarms;

    return alarms.map((alarm) => ({
        ...alarm,
        nextActivation: getNextAlarm(alarm.id)
    }));
};

export const initializeAlarms = (alarms) => {

    alarms.forEach((alarm) => {
        const schedule = getSchedule(alarm);
        alarmJobs[alarm.id] = scheduleJob(alarm.name, schedule, startAlarmPlayback);
    });
};
