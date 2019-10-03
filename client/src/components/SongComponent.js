import React, {useState} from 'react';
import { Col, Media, Button, Progress } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fas from '@fortawesome/free-solid-svg-icons';
import * as far from '@fortawesome/free-regular-svg-icons';
import CoverFlow from 'react-coverflow';

import { apiBaseUrl } from '../helpers/baseUrls';

export const SongControls = (props) => {
	const [displayReplay, setDisplayReplay] = useState(false);
	const {currentSong, playerRunning, isPaused, songHistory} = props;
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

	const showReplay = () => {
		setDisplayReplay(true);
	};

	const hideReplay = () => {
		setDisplayReplay(false);
	};
	
	const songPlayed = Math.round(100*parseInt(currentSong.currentSong.songPlayed)/parseInt(currentSong.currentSong.songDuration));
	
	const handleClick = (command) => {
		console.log("Execute Pianobar command: " + command);
		fetch(apiBaseUrl + command, {method: 'post'})
			.then(response => console.log(response), error => console.log(error));
	}

    return(
        <Col className="song-controls">
			<CoverFlow
				displayQuantityOfSide={1}
				navigation={true}
				active={songHistory.length}
				enableScroll={true}
				enableHeading={true}
				width="100%"
				height="600"
			>
				{songHistory.reverse().map((song) => {
					return (
						<img src={song.coverArt} alt={song.title} width="100%" height="100%" style={{
							maxHeight: 400,
							maxWidth:400,
							alignContent: 'center'
						}} mode='fit'/>
					);
				})}
			</CoverFlow>
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
