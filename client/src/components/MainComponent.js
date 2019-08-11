import React, { useState, useEffect } from 'react';
import { Button, Alert } from 'reactstrap';

import Header from './HeaderComponent';
import Footer from './FooterComponent';
import { StationSelect } from './StationsComponent';
import SongControls from './SongComponent';
import { apiBaseUrl, SSEUrl } from '../helpers/baseUrls';

export const Main = (props) => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isAlerting, setIsAlerting] = useState(false);
    const [alertValue, setAlertValue] = useState();
    const [eventSource, setEventSource] = useState(new EventSource(SSEUrl));

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    }

    const eventHandlers = {
        'pandora': (e) => props.updatePandora(e.data),
        'player': (e) => props.updatePlayer(e.data)
    };

    useEffect(() => {
        if (!eventSource){
            setEventSource(new EventSource(SSEUrl));
        }

        eventSource.onmessage = (e) => {
            setAlertValue(e);
            setIsAlerting(true);
        }

        return () => eventSource.close();
    },[]);

    setTimeout(eventSource.close(), 10000);

    const startPlayer = () => {
        fetch(apiBaseUrl + '/player?command=STARTPLAYER', { method: 'post' })
            .then(response => console.log(response), error => console.log(error));
    };

    const Body = () => {
        if (props.player.playerRunning) {
            return (
                <>
                    <Alert isOpen={isAlerting} >{alertValue}</Alert>
                    <StationSelect
                        stationList={props.pandora.stationList}
                        currentStation={props.pandora.currentStation}
                        playerRunning={props.player.playerRunning}
                    />
                    <br />
                    <SongControls
                        currentSong={props.pandora.currentSong}
                        playerRunning={props.player.playerRunning}
                        isPaused={props.player.isPaused}
                    />
                </>
            );
        }

        return (
            <>
                <Button
                    id="startPlayer"
                    key="startPlayer"
                    color='light'
                    onClick={() => startPlayer()}
                >Start Player</Button>
            </>
        );
    }

    return (
        <div>
            <Header isNavOpen={isNavOpen} toggleNav={toggleNav} />
            <br />
            <Body />
            <br />
            <Footer />
        </div>
    );
}
