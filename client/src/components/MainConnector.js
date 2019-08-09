import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Main } from './MainComponent'
import * as ActionCreators from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        pandora: state.pandora,
        player: state.player
    }
};

const mapDispatchToProps = (dispatch) => ({
    fetchCurrentSong: () => {dispatch(ActionCreators.fetchCurrentSong())},
    fetchIsPaused: () => {dispatch(ActionCreators.fetchIsPaused())},
    fetchPandora: () => {dispatch(ActionCreators.fetchPandora())},
    fetchPlayer: () => {dispatch(ActionCreators.fetchPlayer())},
    fetchPlayerRunning: () => {dispatch(ActionCreators.fetchPlayerRunning())},
    updateSongRating: () => {dispatch(ActionCreators.updateSongRating())},
    fetchStations: () => {dispatch(ActionCreators.fetchStations())}
});

export const getMainConnector = () => withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));

export const MainConnector = getMainConnector();