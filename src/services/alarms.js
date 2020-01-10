// @flow

import {scheduleJob} from 'node-schedule';
import {v4} from 'uuid';

import { startPianoBar } from './pianobar';
import { getPlayerState } from '../routes/api/player';
import { getSettings, updateSetting } from './settings';

type newAlarm = {
    name: string,
    isEnabled: boolean,
    minute: string,
    hour: string,
    dayOfWeek: string
};

type alarmSettings = {
    ...newAlarm,
    id: string
}

type alarmWithDate = {
    ...alarmSettings,
    nextActivation: Date
}

const alarms = {};

const getNextAlarm = (alarmId: string): Date => {
    return alarms[alarmId].nextInvocation();
}

export const removeAlarm = (alarmId: string) => {
    alarms[alarmId].cancel();
};

export const addAlarm = (alarmSettings: newAlarm): ?Date => {
    const newAlarm = {
        ...alarmSettings,
        id: v4()
    };

    const currentAlarms = getSettings().alarms;

    currentAlarms.push(newAlarm);

    updateSetting('alarms', currentAlarms);

    if (newAlarm.isEnabled) {
        const schedule = `${newAlarm.minute} ${newAlarm.hour} * * ${newAlarm.dayOfWeek}`;
        alarms[newAlarm.id] = scheduleJob(newAlarm.name, schedule, () => {
            if (!getPlayerState().playerRunning) {
                startPianoBar();
            }
        });
        return getNextAlarm(newAlarm.id);
    }
};

export const updateAlarm = (updatedAlarm: alarmSettings): ?Date => {
    const currentAlarms = getSettings().alarms; 

    const newAlarms = currentAlarms.map((alarm: alarmSettings): alarmSettings => {
        if (alarm.id == updatedAlarm.id) {
            return updatedAlarm;
        }

        return alarm;
    })

    updateSetting('alarms', newAlarms);


    if (updatedAlarm.isEnabled) {
        const schedule = `${updatedAlarm.minute} ${updatedAlarm.hour} * * ${updatedAlarm.dayOfWeek}`;
        alarms[updatedAlarm.id].reschedule(schedule);
        return getNextAlarm(updatedAlarm.id);
    }

    removeAlarm(updatedAlarm.id);
};

export const getAlarms = (): Array<alarmWithDate> => {
    const alarms = getSettings().alarms;

    return alarms.map((alarm) => ({
        ...alarm,
        nextActivation: getNextAlarm(alarm.id)
    }));
}
