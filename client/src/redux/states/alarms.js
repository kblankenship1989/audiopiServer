import t from 'tcomb';
import { Relays } from './relays';

export const Alarm = t.struct({
    id: t.String,
    name: t.String,
    minute: t.String,
    hour: t.String,
    dayOfWeek: t.String,
    isEnabled: t.Boolean,
    relays: Relays
}, 'Alarm');
