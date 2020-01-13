import t from 'tcomb';
import { Song, getDefaultSong } from './song';
import { Station } from './station';

export const Pandora = t.struct({
    isLoading: t.Boolean,
    currentSong: Song,
    stationList: t.list(Station),
    songHistory: t.list(Song)
}, 'Pandora');

export const getDefaultPandora = () => Pandora({
    isLoading: true,
    currentSong: getDefaultSong(),
    stationList: [],
    songHistory: []
})
