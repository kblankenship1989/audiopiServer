import * as ActionTypes from './ActionTypes';
import { apiBaseUrl } from '../helpers/baseUrls';

const fetchAndDispatch = (call, loading, add, failed) => (dispatch) => {
    if (loading) {
        dispatch(loading());
    }

    return fetch(apiBaseUrl + call)
        .then(response => {
            if (response.ok) {
                return response;
            }
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        },
            error => {
                var errmess = new Error(error.message);
                throw errmess;
            })
        .then(response => response.json())
        .then(data => dispatch(add(data)))
        .catch(error => dispatch(failed(error.message)));
}

export const fetchPlayer = () => fetchAndDispatch('/player', playerLoading, addPlayer, playerFailed);

export const fetchIsPaused = () => fetchAndDispatch('/player', undefined, updateIsPaused, playerFailed);

export const fetchPlayerRunning = () => fetchAndDispatch('/player', undefined, updatePlayerRunning, playerFailed);

export const fetchPandora = () => fetchAndDispatch('/pandora', pandoraLoading, addPandora, pandoraFailed);

export const fetchCurrentSong = () => fetchAndDispatch('/pandora', currentSongLoading, updateCurrentSong, pandoraFailed);

export const fetchStations = () => fetchAndDispatch('/pandora/stations', undefined, updateStations, pandoraFailed);

export const playerLoading = () => ({
    type: ActionTypes.PLAYER_LOADING
});

export const playerFailed = (errmess) => ({
    type: ActionTypes.PLAYER_FAILED,
    payload: errmess
});

export const addPlayer = (player) => ({
    type: ActionTypes.ADD_PLAYER,
    payload: player
});

export const updateIsPaused = (player) => ({
    type: ActionTypes.UPDATE_ISPAUSED,
    payload: player.isPaused
});

export const updatePlayerRunning = (player) => ({
    type: ActionTypes.UPDATE_PLAYERRUNNING,
    payload: player.playerRunning
});

export const pandoraLoading = () => ({
    type: ActionTypes.PANDORA_LOADING
});

export const pandoraFailed = (errmess) => ({
    type: ActionTypes.PANDORA_FAILED,
    payload: errmess
});

export const addPandora = (pandora) => ({
    type: ActionTypes.ADD_PANDORA,
    payload: pandora
});

export const updateSongRating = () => ({
    type: ActionTypes.UPDATE_SONG_RATING,
    payload: 1
});

export const updateCurrentSong = (pandora) => ({
    type: ActionTypes.UPDATE_CURRENT_SONG,
    payload: pandora.currentSong
});

export const currentSongLoading = () => ({
    type: ActionTypes.CURRENT_SONG_LOADING
});

export const updateStations = (stations) => ({
    type: ActionTypes.UPDATE_STATIONS,
    payload: stations
});
