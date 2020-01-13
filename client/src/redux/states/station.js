import t from 'tcomb';

export const Station = t.struct({
    stationId: t.String,
    stationName: t.String
}, 'Station');
