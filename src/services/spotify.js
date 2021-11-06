import { refreshAccessToken } from "./token_helpers"

export const getDeviceId = async (authToken) => {
    if (!authToken) {
        authToken = await refreshAccessToken();
    }

    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            method: 'GET'
        });

        const {
            devices
        } = await response.json();

        return devices.find((device) => device.name === 'raspotify (pandorapi)').id;
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

export const startPlayback = async (authToken, deviceId, contextUri) => {
    if (!authToken) {
        authToken = await refreshAccessToken();
    }

    if (!deviceId) {
        deviceId = await getDeviceId(authToken);
    }

    const body = {
        "context_uri": contextUri,
        "offset": {
            "position": 5
        },
        "position_ms": 0
    }

    try {
        await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            method: 'PUT',
            body
        });
    } catch (err) {
        console.log(err);
    }
}

export const pausePlayback = async (authToken, deviceId) => {
    if (!authToken) {
        authToken = await refreshAccessToken();
    }

    if (!deviceId) {
        deviceId = await getDeviceId(authToken);
    }

    try {
        await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            method: 'PUT'
        });
    } catch (err) {
        console.log(err);
    }
}