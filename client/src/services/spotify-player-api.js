const playerBaseUrl = 'https://api.spotify.com/v1/me/player';


const getUserDevices = () => {
    fetch(playerBaseUrl + '/devices', {method: 'GET'})
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });
}

export const startConnectOnRaspberryPi = () => {
    const {devices} = getUserDevices();

    const raspberryPi = devices.find((device) => device.name === 'audioPi');

    if (raspberryPi) {
        fetch(playerBaseUrl, {
            method: 'PUT',
            body: {
                device_ids: [
                    raspberryPi.id
                ],
                play: true
            }
        })
    }
}
