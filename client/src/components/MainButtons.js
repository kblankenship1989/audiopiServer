import React from 'react';
import { Button, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fas from '@fortawesome/free-solid-svg-icons';
import * as fab from '@fortawesome/free-brands-svg-icons';

export const MainButtons = () => {
    const openGithub = () => {
        window.open('https://github.com/kblankenship1989/audiopiServer', '_blank');
    };

    const openSpotipi = () => {
        window.open('http://spotipi.local', '_blank');
    }

    return (
        <>
            <Col md={{ size: 4, offset: 4 }}><Button block color='light' onClick={() => {window.location.pathname = `/api/auth/login`}}><FontAwesomeIcon icon={fab.faSpotify} /> Login to Spotify</Button></Col>
            <br />
            <Col md={{ size: 4, offset: 4 }}><Button block color='light' tag={Link} to="/relays" ><FontAwesomeIcon icon={fas.faHome} /> Room Control</Button></Col>
            <br />
            <Col md={{ size: 4, offset: 4 }}><Button block color='light' tag={Link} to="/alarms"><FontAwesomeIcon icon={fas.faCalendarDay} /> Alarms</Button></Col>
            <br />
            <Col md={{ size: 4, offset: 4 }}><Button block color='light' tag={Link} to="/timer"><FontAwesomeIcon icon={fas.faClock} /> Timer</Button></Col>
            <br />
            <Col md={{ size: 4, offset: 4 }}><Button block color='light' onClick={openSpotipi}><FontAwesomeIcon icon={fas.faMusic} /> Spotipi</Button></Col>
            <br />
            <Col md={{ size: 4, offset: 4 }}><Button block color='light' onClick={openGithub}><FontAwesomeIcon icon={fab.faGitAlt} /> Documentation</Button></Col>
        </>
    );
}
