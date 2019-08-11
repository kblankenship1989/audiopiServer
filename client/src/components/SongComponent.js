import React from 'react';
import { Col, Media, Button, Progress } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fas from '@fortawesome/free-solid-svg-icons';
import * as far from '@fortawesome/free-regular-svg-icons';

import { apiBaseUrl } from '../helpers/baseUrls';

function SongControls(props) {
	const {currentSong, playerRunning, isPaused} = props;
	const buttonList = [
		{
			id: 'love',
			class: 'float-left',
			command: '/pandora?command=LOVE',
			icon: currentSong.currentSong.rating === "1" ? fas.faThumbsUp : far.faThumbsUp
		},
		{
			id: 'pauseplay',
			class: '',
			command: '/player?command=PLAYPAUSE',
			icon: isPaused ? fas.faPlay : fas.faPause
		},
		{
			id: 'next',
			class: '',
			command: '/player?command=NEXT',
			icon: fas.faFastForward
		},
		{
			id: 'stop',
			class: '',
			command: '/player?command=STOPPLAYER',
			icon: fas.faStop
		},
		{
			id: 'volumedown',
			class: '',
			command: '/player?command=VOLUME_DOWN',
			icon: fas.faVolumeDown
		},
		{
			id: 'volumeup',
			class: '',
			command: '/player?command=VOLUME_UP',
			icon: fas.faVolumeUp
		},
		{
			id: 'hate',
			class: 'float-right',
			command: '/pandora?command=HATE',
			icon: far.faThumbsDown
		}
	];
	const songPlayed = Math.round(100*parseInt(currentSong.currentSong.songPlayed)/parseInt(currentSong.currentSong.songDuration));
	console.log(songPlayed);
	
	const handleClick = (command) => {
		console.log("Execute Pianobar command: " + command);
		fetch(apiBaseUrl + command, {method: 'post'})
			.then(response => console.log(response), error => console.log(error));
	}

    return(
        <Col md="6 m-auto">
            <Media src={currentSong.currentSong.coverArt} alt={currentSong.currentSong.title} className="col-12 m-auto"/>
            <Media>
                <Media bottom body>
                    <Media heading>{currentSong.currentSong.title}</Media>
                    {currentSong.currentSong.artist}
                </Media>
            </Media>
            <br />
            <Progress value={songPlayed} />
			<br />
			{buttonList.map(songButton => (
				<Button
					id={songButton.id}
					key={songButton.id}
					className={songButton.class}
					disabled={!playerRunning}
					color='light'
					onClick={() => handleClick(songButton.command)}
					><FontAwesomeIcon icon={songButton.icon} /></Button>
			))}
        </Col>
    );
}

export default SongControls;
