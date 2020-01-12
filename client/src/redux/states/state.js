import t from 'tcomb';
import { Relays } from './relays';
import { Settings } from './settings';
import { Pandora } from './pandora';
import { Player } from './player';

export const State = t.struct({
    pandora: Pandora,
    player: Player,
    relays: Relays,
    settings: Settings
}, 'State');
