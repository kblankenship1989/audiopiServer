import fetch from 'node-fetch';
import {writeFile, readFileSync} from 'fs';
import {join} from 'path';
import {networkInterfaces} from 'os';

// eslint-disable-next-line no-undef
const filePath = join(__dirname, '../../.token');

const getIpAddress = () => {
    const nets = networkInterfaces();
    console.log(Object.keys(nets));
    let net;
    try {
        net = Object.entries(nets).find((net) => net[0] === 'eth0')[1];
    } catch (_err) {
        net = Object.entries(nets).find((net) => net[0] === 'wlan0')[1];
    }
    const ipv4Net = net.find((netFam) => netFam.family === 4 || netFam.family === 'IPv4' && !netFam.internal);

    console.log(ipv4Net.address);

    return ipv4Net.address;
}

export const client_id = '34b4f9e3c0954c59a171a424717fdec6'; // Your client id
export const redirect_uri = `http://${getIpAddress()}:3000/api/auth/callback`; // Your redirect uri

let accessToken;

const storeRefreshToken = (refreshToken) => {
    writeFile(filePath, refreshToken, {
        encoding: 'utf8',
        mode: 0o600,
        flag: 'w'
    }, (err) => {
        if (err) {
          console.log('Failed to write:')
          console.log(err);
        } else {
          console.log("File written successfully\n");
        }
    });
}

export const parseAccessTokenResponse = async (response) => {
    const {
        refresh_token,
        access_token,
        expires_in
    } = await response.json();

    storeRefreshToken(refresh_token);

    accessToken = access_token

    setTimeout(() => {
        accessToken = null;
    }, Number(expires_in) * 1000);
}

export const urlEncodeBody = (body) => {
    var formBody = [];
    for (var property in body) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(body[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    return formBody.join("&");
}

const refreshAccessToken = async () => {
    const refreshToken = readFileSync(filePath, 'utf8');

    const body = urlEncodeBody({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id
    });

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body
        });

        if (!response.ok) {
            throw new Error(`Refresh token failed with status: ${response.status} - ${response.statusText}`);
        }
        
        await parseAccessTokenResponse(response);
    } catch (err) {
        console.log(err);

        throw err;
    }
}

export const getAccessToken = async () => {
    if (!accessToken) {
        await refreshAccessToken();
    }


    return accessToken;
}