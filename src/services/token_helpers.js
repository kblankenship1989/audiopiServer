import fetch from 'node-fetch';
import {writeFile, readFileSync} from 'fs';
import {join} from 'path';

// eslint-disable-next-line no-undef
const filePath = join(__dirname, '../../.token');

export const client_id = '34b4f9e3c0954c59a171a424717fdec6'; // Your client id
export const redirect_uri = "http://localhost:3000/api" + "/auth/callback"; // Your redirect uri

export const storeRefreshToken = (refreshToken) => {
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
          console.log("The written has the following contents:");
          console.log(readFileSync(filePath, "utf8"));
        }
    });
}

export const getRefreshToken = () => {
    const refreshToken = readFileSync(filePath, 'utf8');
    console.log('reading: ', refreshToken);
	return refreshToken;
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

export const refreshAccessToken = async () => {
    const refreshToken = getRefreshToken();

    const body = urlEncodeBody({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id
    })

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body
        });

        console.log('refresh: ', response);

        if (!response.ok) {
            throw new Error(`Refresh token failed with status: ${response.status} - ${response.statusText}`);
        }
        const {
            access_token,
            refresh_token
        } = await response.json();

        storeRefreshToken(refresh_token);

        return access_token;
    } catch (err) {
        console.log(err);
        return null;
    }
}