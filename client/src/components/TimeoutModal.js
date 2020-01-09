import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { apiBaseUrl } from '../helpers/baseUrls';

export const TimeoutModal = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(props.player.playerTimedOut);
    }, [props.player.playerTimedOut]);

    const resumePlaying = () => {
        const command = '/player?command=PLAYPAUSE';
        fetch(apiBaseUrl + command, {method: 'POST'})
            .then(response => console.log(response), error => console.log(error));
    };

    const stopPlayer = () => {
        const command = '/player?command=STOPPLAYER';
        fetch(apiBaseUrl + command, {method: 'POST'})
            .then(response => console.log(response), error => console.log(error));
    };

    return (
        <>
            <Modal
                backdrop={"static"}
                isOpen={isOpen}
                keyboard={false}
            >
                <ModalHeader style={{
                    justifyContent: "center"
                }}>Inactivity Timeout</ModalHeader>
                <ModalBody style={{
                    textAlign: "center"
                }}>
                    {`Your listening session will be terminated in ${props.player.minutesRemaining} minutes.`}
                    <br/>
                    Click "Resume" to continue listening.
                </ModalBody>
                <ModalFooter  style={{
                    justifyContent: "center"
                }}>
                    <Button color="primary" onClick={resumePlaying}>Resume</Button>{" "}
                    <Button color="danger" onClick={stopPlayer}>Stop</Button>
                </ModalFooter>
            </Modal>
        </>
    );
}
