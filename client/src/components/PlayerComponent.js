import React from 'react';
import LoadingOverlay from 'react-loading-overlay';

import { StationSelect } from './StationsComponent';
import { SongControls } from './SongComponent';
import { apiBaseUrl } from '../helpers/baseUrls';

export const PlayerComponent = (props) => {
    const onStationChange = (event) => {
        const stationId = event.value;
        if (stationId) {
            const command = '/pandora?command=SETSTATION&stationId=' + stationId.toString();
            console.log("Execute Pianobar command: " + command);
            fetch(apiBaseUrl + command, {method: 'post'})
                .then(response => console.log(response), error => console.log(error));
        }
    }

    return (
        <LoadingOverlay
            active={props.pandora.isLoading}
            spinner
            text="Loading songs..."
        >
            <StationSelect
                stationList={props.pandora.stationList}
                currentStationName={props.pandora.currentSong.currentSong.stationName}
                playerRunning={props.player.playerRunning}
                onChange={onStationChange}
            />
            <br />
            <SongControls
                currentSong={props.pandora.currentSong}
                songHistory={props.pandora.songHistory}
                playerRunning={props.player.playerRunning}
                isPaused={props.player.isPaused}
            />
        </LoadingOverlay>
    );
};
