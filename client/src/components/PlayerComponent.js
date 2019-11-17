import React from 'react';

import { StationSelect } from './StationsComponent';
import { SongControls } from './SongComponent';

export const PlayerComponent = (props) => {
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
                songHistory={props.pandora.songHistory}
                playerRunning={props.player.playerRunning}
                isPaused={props.player.isPaused}
            />
        </>
    );
};
