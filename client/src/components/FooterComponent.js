//Restart Pi, Shutdown Pi, Restart server, Mute all
import React from 'react';

const Footer = (props) => {
    const muteAll = async () => {
        await fetch(apiBaseUrl + `/relays?key=FIRST&value=0`, { method: 'POST' });
        await fetch(apiBaseUrl + `/relays?key=SECOND&value=0`, { method: 'POST' });
    }

    return(
        <>
            <div className="container footer">
                <div className="row justify-content-center">
                    <span onClick={muteAll} >Mute All</span>|<span onClick={() => undefined} >Restart Server</span>
                </div>
            </div>
        </>
    );
}

export default Footer;