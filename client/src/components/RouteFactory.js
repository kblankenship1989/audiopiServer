import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';

import {HomeComponent} from './HomeComponent';
import { SettingsPage } from './SettingsComponent';
import { RelayComponent } from './RelayComponent';
import { Settings } from '../redux/states/settings';
import { Relays } from '../redux/states/relays';

export const RouteFactory = (props) => {
    return (
        <Switch>
            <Route path="/home" render={(routeProps) => <HomeComponent {...routeProps} pandora={props.pandora} player={props.player} />} />
            <Route path="/settings" render={(routeProps) => <SettingsPage {...routeProps} settings={props.settings} updateSettings={props.updateSettings} />} />
            <Route exact path="/relays" render={(routeProps) => <RelayComponent {...routeProps} firstFloorRelayState={props.relays.firstFloorRelayState} secondFloorRelayState={props.relays.secondFloorRelayState} alarmOverride={props.relays.alarmOverride} />} />
            <Redirect to="/home" />
        </Switch>
    );
};

Main.propTypes = {
    pandora: PropTypes.instanceOf(Pandora).isRequired,
    player: PropTypes.instanceOf(Player).isRequired,
    relays: PropTypes.instanceOf(Relays).isRequired,
    settings: PropTypes.instanceOf(Settings).isRequired,
    updateSettings: PropTypes.func.isRequired,
    updatePandora: PropTypes.func.isRequired,
    updatePlayer: PropTypes.func.isRequired,
    updateRelays: PropTypes.func.isRequired
};
