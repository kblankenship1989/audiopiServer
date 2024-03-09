//Restart Pi, Shutdown Pi, Restart server, Mute all
import React from 'react';
import { apiBaseUrl } from '../helpers/baseUrls';

const Footer = () => {
    const muteAll = async () => {
        await fetch(apiBaseUrl + `/relays?key=FIRST&value=0`, { method: 'POST' });
        await fetch(apiBaseUrl + `/relays?key=SECOND&value=0`, { method: 'POST' });
    }

    const restartServer = () => {
        fetch(apiBaseUrl + `/server/restart`, { method: 'POST' })
    }

    return(
        <>
            <div className="container footer">
                <div className="row justify-content-center">
                    <span onClick={muteAll} >Mute All</span>|<span onClick={restartServer} >Restart Server</span>
                </div>
            </div>
        </>
    );
}

export default Footer;
