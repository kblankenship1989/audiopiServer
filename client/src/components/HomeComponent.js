import React from 'react';

import { MainButtons } from './MainButtons';
import { PlayerComponent } from './PlayerComponent';

export const HomeComponent = (props) => {
    return (
        props.player.playerRunning ?
            <PlayerComponent
                pandora={props.pandora}
                player={props.player}
            />
        :
           <MainButtons />
    );
};
