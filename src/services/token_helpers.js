import fetch from 'node-fetch';
import {writeFile, readFileSync} from 'fs';
import {join} from 'path';

export const storeRefreshToken = (refreshToken) => {
	console.log('storing: ', refreshToken);
    writeFile(join(__dirname, '../../.token'), refreshToken);
}

export const getRefreshToken = () => {
    const refreshToken = readFileSync(join(__dirname, '../../.token'));
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
        refresh_token: refreshToken
    })

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body
        });

        const {
            access_token,
            refresh_token
        } = await response.json();

        storeRefreshToken(refresh_token);

        return access_token;
    } catch (err) {
        return null;
    }
}