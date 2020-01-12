import t from 'tcomb';
import { Relays, getDefaultRelays } from './relays';
import { Alarm } from './alarms';

export const Settings = t.struct({
    relays: Relays,
    timeoutInMinutes: t.Integer,
    closeTimeoutInMinutes: t.Integer,
    defaultVolume: t.Integer,
    songHistoryLength: t.Integer,
    alarms: t.list(Alarm)
}, 'Settings');

export const getDefaultSettings = () => Settings({
    relays: getDefaultRelays(),
    timeoutInMinutes: 120,
    closeTimeoutInMinutes: 15,
    defaultVolume: 83,
    songHistoryLength: 5,
    alarms: []
});
