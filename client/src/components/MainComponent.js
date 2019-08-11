import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';

import Header from './HeaderComponent';
import Footer from './FooterComponent';
import { StationSelect } from './StationsComponent';
import SongControls from './SongComponent';
import { apiBaseUrl } from '../helpers/baseUrls';

export const Main = (props) => {
    const [isNavOpen, setIsNavOpen] = useState(false);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    }

    const eventHandlers = {
        'player': (data) => props.updatePlayer(data),
        'pandora': (data) => props.updatePandora(data)
    };

    useEffect(() => {
        if (props.eventSource){
            props.eventSource.onmessage = (e) => {
                if (e.lastEventId === '-1') {
                    eventSource.close();
                } else {
                    eventHandlers[e.event](e.data);
                }
            }
        }
    },[]);

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
        </div>
    );
}
