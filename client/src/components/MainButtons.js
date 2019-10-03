import React from 'react';
import { Button, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fas from '@fortawesome/free-solid-svg-icons';
import * as fab from '@fortawesome/free-brands-svg-icons';
import { apiBaseUrl } from '../helpers/baseUrls';

export const MainButtons = () => {
    const openGithub = () => {
        window.open('https://github.com/kblankenship1989/audiopiServer', '_blank');
    };

    const startPlayer = () => {
        fetch(apiBaseUrl + '/player?command=STARTPLAYER', { method: 'post' })
            .then(response => console.log(response), error => console.log(error));
    };

    return (
        <>
            <Col md={{ size: 4, offset: 4 }}><Button block color='light' onClick={startPlayer}><img src={`${process.env.PUBLIC_URL}/assets/Pandora.png`} width="150" alt="Pandora" /></Button></Col>
            <br />
            <Col md={{ size: 4, offset: 4 }}><Button block color='light' tag={Link} to="/player" ><img src={`${process.env.PUBLIC_URL}/assets/IHeartRadio.png`} width="100" alt="IHeartRadio" /></Button></Col>
            <br />
            <Col md={{ size: 4, offset: 4 }}><Button block color='light' tag={Link} to="/relays" ><FontAwesomeIcon icon={fas.faHome} /> Room Control</Button></Col>
            <br />
            <Col md={{ size: 4, offset: 4 }}><Button block color='light' tag={Link} to="/settings"><FontAwesomeIcon icon={fas.faWrench} /> Settings</Button></Col>
            <br />
            <Col md={{ size: 4, offset: 4 }}><Button block color='light' onClick={openGithub}><FontAwesomeIcon icon={fab.faGitAlt} /> Documentation</Button></Col>
        </>
    );
}
