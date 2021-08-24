import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';

import Header from './HeaderComponent';
import Footer from './FooterComponent';
import { SSEUrl } from '../helpers/baseUrls';
import { SettingsPage } from './SettingsComponent';
import { RelayComponent } from './RelayComponent';
import { MainButtons } from './MainButtons';

export const Main = (props) => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [eventSource, setEventSource] = useState();
    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    }

    const eventHandlers = {
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
            <Header isNavOpen={isNavOpen} toggleNav={toggleNav} />
            <br />
            <Switch>
                <Route path="/home" 
                    component={MainButtons}
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
                <Redirect to="/home"/>
            </Switch>
            <br />
            <Footer />
        </>
    );
}

Main.propTypes = {
    relays: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    updateSettings: PropTypes.func.isRequired,
    updateRelays: PropTypes.func.isRequired
};
