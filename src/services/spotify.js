import { refreshAccessToken } from "./token_helpers"
import fetch from 'node-fetch';

let raspotify;

export const getDeviceId = async () => {
    try {
        if (!raspotify) {
            console.log('Fetching device Id');
            const authToken = await refreshAccessToken();
        
            if (!authToken) {
                throw new Error('No auth token available');
            }
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

export const getPlaylists = async (authToken) => {
    if (!authToken) {
        authToken = await refreshAccessToken();
    }

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

        return items.map((playlist) => ({
            name: playlist.name,
            uri: playlist.uri
        }));
    } catch (err) {
        console.log(err);
        return null;
    }
}

export const startPlayback = async (authToken, contextUri) => {
    if (!authToken) {
        authToken = await refreshAccessToken();
    }

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

        return true;
    } catch (err) {
        console.log(err);
        raspotify = null;
        return false
    }
}

export const pausePlayback = async (authToken) => {
    if (!authToken) {
        authToken = await refreshAccessToken();
    }

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
