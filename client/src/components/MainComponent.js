import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Header from './HeaderComponent';
import Footer from './FooterComponent';
import { SSEUrl } from '../helpers/baseUrls';
import {HomeComponent} from './HomeComponent';
import { Settings } from './SettingsComponent';

export const Main = (props) => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [eventSource, setEventSource] = useState();
    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    }

    const eventHandlers = {
        'pandora': (e) => props.updatePandora(e.data),
        'player': (e) => props.updatePlayer(e.data)
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
                render={(routeProps) => <HomeComponent
                    {...routeProps}
                    pandora={props.pandora}
                    player={props.player}
                />} />
                <Route path="/settings" component={Settings} />
                <Redirect to="/home" />
            </Switch>
            <br />
            <Footer />
        </>
    );
}
