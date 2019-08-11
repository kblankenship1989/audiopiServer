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

    useEffect(() => {
        if (props.SSEPlayerState) {
            props.updatePlayer(props.SSEPlayerState);
        }

        if (props.SSEPandoraState) {
            props.updatePandora(props.SSEPandoraState);
        }
    },[props.SSEPlayerState, props.SSEPandoraState]);

    const startPlayer = () => {
        fetch(apiBaseUrl + '/player?command=STARTPLAYER', { method: 'post' })
            .then(response => console.log(response), error => console.log(error));
    };

    const Body = () => {
        if (props.player.playerRunning && !props.player.isLoading && !props.pandora.isLoading) {
            return (
                <>
                    <StationSelect
                        stationList={props.pandora.stationList}
                        currentStationName={props.pandora.currentSong.currentSong.stationName}
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
