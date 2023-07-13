import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Main } from './MainComponent'
import * as ActionCreators from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        relays: state.relays,
        settings: state.settings
    }
};

const mapDispatchToProps = (dispatch) => ({
    updateRelays: (newRelays) => {dispatch(ActionCreators.updateRelays(newRelays))},
    updateSettings: (newSettings) => {dispatch(ActionCreators.updateSettings(newSettings))}
});

export const getMainConnector = () => withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));

export const MainConnector = getMainConnector();