import { getAccessToken } from "./token_helpers"
import fetch from 'node-fetch';

let raspotify;
let playlists;
let playbackPauseTimeout;

const setPlaybackTimeout = (timeoutInMinutes) => {
    if (playbackPauseTimeout) {
        clearTimeout(playbackPauseTimeout);
    }
    playbackPauseTimeout = setTimeout(async () => {
        pausePlayback()
    }, timeoutInMinutes * 60000)
};

export const getDeviceId = async () => {
    try {
        if (!raspotify) {
            console.log('Fetching device Id');
            const authToken = await getAccessToken();

            const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                method: 'GET'
            });
            const jsonResponse = await response.json();

            const {
                devices
            } = jsonResponse;

            raspotify = devices.find((device) => device.name === 'raspotify (pandorapi)'); // point to /etc/default/raspotify -> DEVICE_NAME
        }

        if (raspotify) {
            return raspotify.id;
        }

        throw new Error('Raspotify not available.');
    } catch (err) {
        console.log(err);
        return null;
    }
}

export const getPlaylists = async (shouldRefresh) => {
    if (playlists && !shouldRefresh) {
        console.log('returning saved playlists');
        return playlists;
    }

    console.log('fetching playlists from spotify');

    const authToken = await getAccessToken();

    try {
        const response = await fetch('https://api.spotify.com/v1/me/playlists', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            method: 'GET'
        });

        const {
            items
        } = await response.json();

        playlists = items.map((playlist) => ({
            name: playlist.name,
            uri: playlist.uri
        }));

        return playlists;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export const startPlayback = async (contextUri, timeoutInMinutes) => {
    const authToken = await getAccessToken();

    if (!raspotify) {
        await getDeviceId();
    }
    console.log('deviceId: ', raspotify.id);

    const body = JSON.stringify({
        "context_uri": contextUri,
        "offset": {
            "position": 1
        },
        "position_ms": 0
    });
    console.log(body);

    try {
        await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${raspotify.id}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            method: 'PUT',
            body
        });

        if (timeoutInMinutes) {
            setPlaybackTimeout(timeoutInMinutes);
        }

        return true;
    } catch (err) {
        console.log(err);
        raspotify = null;
        return false
    }
}

export const pausePlayback = async () => {
    const authToken = await getAccessToken();

    if (!raspotify) {
        await getDeviceId();
    }

    try {
        await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${raspotify.id}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            method: 'PUT'
        });
    } catch (err) {
        console.log(err);

        raspotify = null;
    }
}
