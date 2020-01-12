import t from 'tcomb';

export const Player = t.struct({
    isPaused: t.Boolean,
    minutesRemaining: t.Integer,
    playerRunning: t.Boolean,
    playerTimedOut: t.Boolean
}, 'Player');
