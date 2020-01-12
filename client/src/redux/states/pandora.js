import t from 'tcomb';
import { Song } from './song';
import { Station } from './station';

export const Pandora = t.struct({
    isLoading: t.Boolean,
    currentSong: Song,
    stationList: t.list(Station),
    songHistory: t.list(Song)
}, 'Pandora');
