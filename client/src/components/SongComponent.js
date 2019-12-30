import React, {useState, useEffect} from 'react';
import { 
	Col,
	Button, 
	//Progress, 
	Carousel, 
	CarouselItem, 
	CarouselCaption, 
	CarouselControl
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fas from '@fortawesome/free-solid-svg-icons';
import * as far from '@fortawesome/free-regular-svg-icons';

import { apiBaseUrl } from '../helpers/baseUrls';

export const SongControls = (props) => {
	const {currentSong, playerRunning, isPaused, songHistory} = props;
	const [currentDisplayIndex, setCurrentDisplayIndex] = useState(songHistory.length-1);
	const [displayCaption, setDisplayCaption] = useState('');
	const currentSongClass = currentDisplayIndex === songHistory.length -1 ? '' : 'd-none';

	useEffect(() => {
		setCurrentDisplayIndex(songHistory.length-1);
	}, [songHistory])

	const replayIndex = songHistory.length-2-currentDisplayIndex;

	const buttonList = [
		{
			id: 'love',
			class: `${currentSongClass} float-left`,
			command: '/pandora?command=LOVE',
			icon: currentSong.currentSong.rating === "1" ? fas.faThumbsUp : far.faThumbsUp
		},
		{
			id: 'pauseplay',
			class: currentSongClass,
			command: '/player?command=PLAYPAUSE',
			icon: isPaused ? fas.faPlay : fas.faPause
		},
		{
			id: 'replay',
			class: currentDisplayIndex === songHistory.length -1 ? 'd-none' : '',
			command: `/player?command=REPLAY&songIndex=${replayIndex}`,
			icon: fas.faRedoAlt
		},
		{
			id: 'next',
			class: currentSongClass,
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
			class: `${currentSongClass} float-right`,
			command: '/pandora?command=HATE',
			icon: far.faThumbsDown
		}
	];

	const toggleCaption = () => {
		Boolean(displayCaption) ? setDisplayCaption('') : setDisplayCaption('display-caption');
	}

	const progressNext = () => {
		setCurrentDisplayIndex(currentDisplayIndex+1);
	}

	const progressPrevious = () => {
		setCurrentDisplayIndex(currentDisplayIndex-1);
	}
	
	//const songPlayed = Math.round(100*parseInt(currentSong.currentSong.songPlayed)/parseInt(currentSong.currentSong.songDuration));
	
	const handleClick = (command) => {
		console.log("Execute Pianobar command: " + command);
		fetch(apiBaseUrl + command, {method: 'post'})
			.then(response => console.log(response), error => console.log(error));
	}
	const songHistoryReveresed = [...songHistory].reverse();
	const songs = songHistoryReveresed.map((song, index) => {
		return (
		  <CarouselItem
			key={`${index} - ${song.coverArt}`}
		  >
			<img src={song.coverArt} alt={song.title} 
				onClick={toggleCaption}/>
			<CarouselCaption 
				captionText={`${song.album} - ${song.artist}`} 
				captionHeader={song.title}
				className={displayCaption} />
		  </CarouselItem>
		);
	  });

    return(
        <Col className="song-controls">
			<Carousel
				activeIndex={currentDisplayIndex}
				interval={false}
				previous={progressPrevious}
				next={progressNext}
			>
				{songs}
				{Boolean(currentDisplayIndex) && <CarouselControl direction="prev" directionText="Previous" onClickHandler={progressPrevious} />}
        		{(currentDisplayIndex !== songHistory.length-1) && <CarouselControl direction="next" directionText="Next" onClickHandler={progressNext} />}
			</Carousel>
            <br />
            {/*<Progress value={songPlayed} />
			<br />*/}
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
