//Restart Pi, Shutdown Pi, Restart server, Mute all
import React from 'react';

function Footer(props) {
    return(
        <>
            <div className="container">
                <div className="row justify-content-center">
                    <span onClick={() => undefined} >Mute All</span> | <span onClick={() => undefined} >Restart Server</span>
                </div>
            </div>
        </>
    );
}

export default Footer;