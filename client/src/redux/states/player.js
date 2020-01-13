import t from 'tcomb';

export const Player = t.struct({
    isPaused: t.Boolean,
    minutesRemaining: t.Integer,
    playerRunning: t.Boolean,
    playerTimedOut: t.Boolean
}, 'Player');

export const getDefaultPlayer = () => Player({
    isPaused: false,
    minutesRemaining: 0,
    playerRunning: true,
    playerTimedOut: false
});
