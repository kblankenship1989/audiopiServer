import React from 'react';
import { Col } from 'reactstrap';
import Select from 'react-select';

export const StationSelect = ({stationList, currentStationName, playerRunning, onChange}) => {

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

    return(
        <Col md="5 m-auto">
            <Select
                value={getCurrentStation()}
                options={stationsOptions()}
                onChange={onchange}
            />
        </Col>
    );
};
