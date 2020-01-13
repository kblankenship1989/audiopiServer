import t from 'tcomb';

export const Song = t.struct({
    artist: t.String,
    title: t.String,
    album: t.String,
    coverArt: t.String,
    rating: t.String,
    stationName: t.String
}, 'Song');

export const getDefaultSong = () => Song({
    artist: '',
    title: '',
    album: '',
    coverArt: '',
    rating: '',
    stationName: ''
});
