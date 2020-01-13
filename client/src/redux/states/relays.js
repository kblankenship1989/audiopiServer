import t from 'tcomb';

export const Relays = t.struct({
    firstFloorRelayState: t.String,
    secondFloorRelayState: t.String,
    alarmOverride: t.Boolean
}, 'Relays');

export const getDefaultRelays = () => Relays({
    firstFloorRelayState: '0000',
    secondFloorRelayState: '0000',
    alarmOverride: false
});
