import * as ActionTypes from './ActionTypes';

const emptyState = {
    isLoading: true,
    currentSong: {
        isLoading: true,
        currentSong: {}
    },
    stationList: [],
    songHistory: [
        {
            artist: "Philip Wesley",
            title: "New Day",
            album: "Dark Night Of The Soul",
            coverArt: "http://mediaserver-cont-sv5-2-v4v6.pandora.com/images/public/int/3/2/2/2/619981272223_500W_500H.jpg",
            rating: 0,
            stationName: "Indignation Radio"
        },
        {
            artist: "Philip Wesley",
            title: "New Day",
            album: "Dark Night Of The Soul",
            coverArt: "http://mediaserver-cont-sv5-2-v4v6.pandora.com/images/public/int/3/2/2/2/619981272223_500W_500H.jpg",
            rating: 0,
            stationName: "Indignation Radio"
        },
        {
            artist: "Philip Wesley",
            title: "New Day",
            album: "Dark Night Of The Soul",
            coverArt: "http://mediaserver-cont-sv5-2-v4v6.pandora.com/images/public/int/3/2/2/2/619981272223_500W_500H.jpg",
            rating: 0,
            stationName: "Indignation Radio"
        },
        {
            artist: "Philip Wesley",
            title: "New Day",
            album: "Dark Night Of The Soul",
            coverArt: "http://mediaserver-cont-sv5-2-v4v6.pandora.com/images/public/int/3/2/2/2/619981272223_500W_500H.jpg",
            rating: 0,
            stationName: "Indignation Radio"
        },
        {
            artist: "Philip Wesley",
            title: "New Day",
            album: "Dark Night Of The Soul",
            coverArt: "http://mediaserver-cont-sv5-2-v4v6.pandora.com/images/public/int/3/2/2/2/619981272223_500W_500H.jpg",
            rating: 0,
            stationName: "Indignation Radio"
        }
    ]
};

export const Pandora = (state = emptyState, action) => {

    const actionMap = {
        [ActionTypes.ADD_PANDORA]: {
            ...state,
            ...action.payload,
            currentSong: {
                ...state.currentSong,
                ...(action.payload ? 
                    action.payload.currentSong : 
                    {}),
                isLoading: false
            }, 
            isLoading: false 
        }
    };

    return Object.keys(actionMap).includes(action.type) ? actionMap[action.type] : state;
}