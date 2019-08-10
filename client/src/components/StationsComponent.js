import React from 'react';
import { Col } from 'reactstrap';
import Select from 'react-select';
import { apiBaseUrl } from '../helpers/baseUrls';

export const StationSelect = ({stationList, currentStationName, playerRunning}) => {

    const stationsOptions = () => (stationList.map(station => {
        return {
            value: station.stationId,
            label: station.stationName
        }
    }));

    const getCurrentStation = () => {
        if (currentStationName && playerRunning) {
            return stationsOptions().find(station => station.label === currentStationName);
        }
    }

    const onStationChange = (event) => {
        const stationId = event.value;
        if (stationId) {
            const command = '/pandora?command=SETSTATION&stationId=' + stationId.toString();
            console.log("Execute Pianobar command: " + command);
            fetch(apiBaseUrl + command, {method: 'post'})
                .then(response => console.log(response), error => console.log(error));
        }
    }

    return(
        <Col md="5 m-auto">
            <Select
                value={getCurrentStation()}
                options={stationsOptions()}
                onChange={(event) => onStationChange(event)}
            />
        </Col>
    );
};
