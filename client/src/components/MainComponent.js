import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';

import Header from './HeaderComponent';
import Footer from './FooterComponent';
import { SSEUrl } from '../helpers/baseUrls';
import {HomeComponent} from './HomeComponent';
import { SettingsPage } from './SettingsComponent';
import { TimeoutModal } from './TimeoutModal';
import { RelayComponent } from './RelayComponent';
import { Settings } from '../redux/states/settings';
import { Relays } from '../redux/states/relays';

export const Main = (props) => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [eventSource, setEventSource] = useState();
    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    }

    const eventHandlers = {
        'pandora': (e) => props.updatePandora(e.data),
        'player': (e) => props.updatePlayer(e.data),
        'relays': (e) => props.updateRelays(e.data)
    };

    useEffect(() => {
        if (!eventSource) {
            setEventSource(new EventSource(SSEUrl));
        } else {
            eventSource.onopen = () => {
                console.log('Source opened!');
            }

            eventSource.onerror = () => {
                console.log(eventSource.readyState);
            }

            Object.keys(eventHandlers).forEach((eventType) => {
                eventSource.addEventListener(eventType, (e) => {
                    eventHandlers[eventType](e);
                });
            });
        }
    }, [eventSource]);

    useEffect(() => {
        return () => {if (eventSource) {eventSource.close()}};
    }, []);

    return (
        <>
            <TimeoutModal player={props.player} />
            <Header isNavOpen={isNavOpen} toggleNav={toggleNav} />
            <br />
            <Switch>
                <Route path="/home" 
                render={(routeProps) => <HomeComponent
                    {...routeProps}
                    pandora={props.pandora}
                    player={props.player}
                    />}
                />
                <Route path="/settings" 
                    render={(routeProps) => <SettingsPage
                        {...routeProps}
                        settings={props.settings}
                        updateSettings={props.updateSettings}
                    />}
                />
                <Route exact path="/relays"
                    render={(routeProps) => <RelayComponent
                        {...routeProps}
                        firstFloorRelayState={props.relays.firstFloorRelayState}
                        secondFloorRelayState={props.relays.secondFloorRelayState}
                        alarmOverride={props.relays.alarmOverride}
                    />}
                />
                <Redirect to="/home" />
            </Switch>
            <br />
            <Footer />
        </>
    );
}

Main.propTypes = {
    relays: PropTypes.instanceOf(Relays).isRequired,
    settings: PropTypes.instanceOf(Settings).isRequired,
    updateSettings: PropTypes.func.isRequired,
    updatePandora: PropTypes.func.isRequired,
    updatePlayer: PropTypes.func.isRequired,
    updateRelays: PropTypes.func.isRequired
};
