import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Main } from './MainComponent'
import * as ActionCreators from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        pandora: state.pandora,
        player: state.player,
        relays: state.relays
    }
};

const mapDispatchToProps = (dispatch) => ({
    updatePandora: (newPandora) => {dispatch(ActionCreators.updatePandora(newPandora))},
    updatePlayer: (newPlayer) => {dispatch(ActionCreators.updatePlayer(newPlayer))},
    updateRelays: (newRelays) => {dispatch(ActionCreators.updateRelays(newRelays))}
});

export const getMainConnector = () => withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));

export const MainConnector = getMainConnector();