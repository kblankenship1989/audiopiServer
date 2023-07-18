import React, { useState, useEffect } from 'react';
import * as fas from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormGroup, Label, Input, Row, Button} from 'reactstrap';
import { apiBaseUrl } from '../helpers/baseUrls';

export const PlaylistSelect = ({currentValue, onSelect}) => {
    const [playlists, setPlaylists] = useState([]);

    const fetchPlaylists = (refresh = false) => {
        fetch(apiBaseUrl + `/playback/playlists?refresh=${refresh}`, { method: 'GET' })
            .then((response) => {
                return response.json();
            })
            .then((playlistResponse) => {
                if (playlistResponse)
                    setPlaylists(playlistResponse);
                else
                    throw new Error('No playlists returned');
            })
            .catch((e) => { console.log(e) });
    }

    useEffect(() => {
        fetchPlaylists(false);
    }, []);

    return (
        <FormGroup>
            <Row>
                <Label className="col-md-3" for="context-uri">Playlist</Label>
                <Input
                    className="col-md-3 col-10"
                    id={'context-uri'}
                    name={'context-uri'}
                    onChange={onSelect}
                    value={selectedAlarm.contextUri}
                    type={'select'}
                >
                    <option value="">Select Playlist</option>
                    {playlists.map((playlist) => (
                        <option value={playlist.uri}>{playlist.name}</option>
                    ))}
                </Input>
                <Button className='col-2' onClick={() => fetchPlaylists(true)}>
                    <FontAwesomeIcon icon={fas.faRedo} />
                </Button>
            </Row>
        </FormGroup>
    );
}
