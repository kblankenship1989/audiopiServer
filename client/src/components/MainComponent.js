import React, { useState, useEffect } from 'react';
import WebSocket from 'react-websocket';
import { Button } from 'reactstrap';

import Header from './HeaderComponent';
import Footer from './FooterComponent';
import { StationSelect } from './StationsComponent';
import SongControls from './SongComponent';
import { apiBaseUrl, wsBaseUrl } from '../helpers/baseUrls';

export const Main = (props) => {
    const [isNavOpen, setIsNavOpen] = useState(false);

    const { fetchPandora, fetchPlayer } = props;

    useEffect(() => {
        fetchPandora();
        fetchPlayer();
    }, []);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    }

    const handleMessage = (message) => {
        console.log(message);
        const updateOn = JSON.parse(message).updateOn;
        console.log(updateOn);

        const updateTriggers = {
            'player': props.fetchPlayer,
            'pandora': props.fetchPandora,
            'isPaused': props.fetchIsPaused,
            'playerRunning': props.fetchPlayerRunning,
            'rating': props.updateSongRating,
            'currentSong': props.fetchCurrentSong,
            'station': props.fetchStations
        }

        return Object.keys(updateTriggers).includes(updateOn) ? updateTriggers[updateOn]() : null;
    };

    const startPlayer = () => {
        fetch(apiBaseUrl + '/player?command=STARTPLAYER', { method: 'post' })
            .then(response => console.log(response), error => console.log(error));
    };

    const Body = () => {
        if (props.player.playerRunning) {
            return (
                <>
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
            <WebSocket
                url={wsBaseUrl}
                onMessage={handleMessage}
            />
        </div>
    );
}
