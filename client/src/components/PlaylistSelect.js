import React, { useState, useEffect } from 'react';
import * as fas from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormGroup, Label, Input, Row, Button, Col} from 'reactstrap';
import { apiBaseUrl } from '../helpers/baseUrls';

export const PlaylistSelect = ({onSelect, playlistUri, startSongIndex, shuffleState}) => {
    const [playlists, setPlaylists] = useState([]);
    const [tracks, setTracks] = useState([]);

    const fetchPlaylists = async (refresh = false) => {
        try {
            const response = await fetch(apiBaseUrl + `/playback/playlists?refresh=${refresh}`, { method: 'GET' })
            const playlistResponse = await response.json();

            if (playlistResponse.length)
                setPlaylists(playlistResponse);
            else
                throw new Error('No playlists returned');
        } catch(e) {
            console.log(e);
        }
    }

    const fetchTracks = (newPlaylistUri) => {
        const currentPlaylist = playlists.find((playlist) => playlist.uri === newPlaylistUri);

        fetch(apiBaseUrl + `/playback/tracks?playlistId=${currentPlaylist.playlistId}`, { method: 'GET' })
            .then((response) => {
                return response.json();
            })
            .then((tracksResponse) => {
                if (tracksResponse.length)
                    setTracks(tracksResponse);
                else
                    throw new Error('No tracks returned');
            })
            .catch((e) => { console.log(e) });
    }

    useEffect(() => {
        fetchPlaylists(false);
    }, []);

    useEffect(() => {
        if (playlistUri && playlists.length) {
            fetchTracks(playlistUri)
        }
    }, [playlistUri, playlists]);

    const onChangePlaylist = (e) => {
        onSelect(e, 'contextUri');
        if (e.target.value) {
            fetchTracks(e.target.value);
        }
    }

    return (
        <>
            <FormGroup>
                <Row>
                    <Label className="col-md-3" for="context-uri">Playlist</Label>
                    <Input
                        className="col-md-3 col-10"
                        id={'context-uri'}
                        name={'context-uri'}
                        onChange={onChangePlaylist}
                        value={playlistUri}
                        type={'select'}
                    >
                        <option value="">Select Playlist</option>
                        {playlists.map((playlist) => (
                            <option value={playlist.uri}>{playlist.name}</option>
                        ))}
                    </Input>
                    <Col className='col-1'/>
                    <Button
                        className='col-1'
                        onClick={() => fetchPlaylists(true)}
                        size='sm'
                    >
                        <FontAwesomeIcon icon={fas.faRedo}/>
                    </Button>
                </Row>
            </FormGroup>
            <FormGroup>
                <Row>
                    <Label className="col-md-3" for="start-song-index">Start Track</Label>
                    <Input
                        className="col-md-3 col-10"
                        disabled={!playlistUri}
                        id={'start-song-index'}
                        name={'start-song-index'}
                        onChange={(e) => onSelect(e, 'startSongIndex')}
                        value={startSongIndex}
                        type={'select'}
                    >
                        {tracks.map((track, index) => (
                            <option value={index}>{track.name}</option>
                        ))}
                    </Input>
                    <Col className='col-1'/>
                    <Button
                        className='col-1'
                        color={shuffleState ? 'primary' : 'secondary'}
                        onClick={() => onSelect({target: {value: !shuffleState}}, 'shuffleState')}
                        disabled={!playlistUri}
                        size='sm'
                    >
                        <FontAwesomeIcon icon={fas.faRandom}/>
                    </Button>
                </Row>
            </FormGroup>
        </>
    );
}
