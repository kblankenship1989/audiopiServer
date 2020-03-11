import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Header from './HeaderComponent';
import Footer from './FooterComponent';
import { SSEUrl } from '../helpers/baseUrls';
import { TimeoutModal } from './TimeoutModal';
import { Settings } from '../redux/states/settings';
import { Relays } from '../redux/states/relays';
import { Player } from '../redux/states/player';
import { RouteFactory } from './RouteFactory';

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
            <RouteFactory
                {...props}
            />
            <br />
            <Footer />
        </>
    );
}

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
