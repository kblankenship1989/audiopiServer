import React from 'react';
import { Button, CardHeader, Card, Row, Label } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fas from '@fortawesome/free-solid-svg-icons';
import { apiBaseUrl } from '../helpers/baseUrls';

export const RelayComponent = (props) => {
    const toggleRelayState = (leftIndex, rightIndex, floor) => {
        let currentState;
        const testIndex = (1 << leftIndex) | (1 << rightIndex);

        if(floor === 'FIRST') {
            currentState = parseInt(props.relays.firstFloor, 16);
        } else if(floor === 'SECOND') {
            currentState = parseInt(props.relays.secondFloor, 16);
        } else {
            return;
        }
        const newState = currentState ^ testIndex;
        fetch(apiBaseUrl + `/relays?floor=${floor}&value=${newState}`, { method: 'post' })
            .then(response => console.log(response), error => console.log(error));
    }

    const getRelayButton = (state, label, clickHandler) => {
        return(
            <Button
                block 
                color={state ? 'success' : 'danger'}
                onClick={clickHandler}>
                <FontAwesomeIcon size="2x" icon={state ? fas.faToggleOn : fas.faToggleOff} onClick={clickHandler}/>
                <Label>{label}</Label>
            </Button>
        )
    }

    const firstFloorControls = [
        {
            label: 'Kitchen',
            leftIndex: 0,
            rightIndex: 15,
            onState: 0
        },
        {
            label: 'Office',
            leftIndex: 1,
            rightIndex: 14,
            onState: 0
        },
        {
            label: 'Patio',
            leftIndex: 2,
            rightIndex: 13,
            onState: 0
        },
        {
            label: 'Basement',
            leftIndex: 3,
            rightIndex: 12,
            onState: 0
        },
        {
            label: 'Garage',
            leftIndex: 4,
            rightIndex: 11,
            onState: 0
        }
    ];

    const secondFloorControls = [
        {
            label: 'Master Bedroom',
            leftIndex: 0,
            rightIndex: 15,
            onState: 0
        },
        {
            label: 'Master Closet',
            leftIndex: 1,
            rightIndex: 14,
            onState: 0
        },
        {
            label: 'Master Bathroom',
            leftIndex: 2,
            rightIndex: 13,
            onState: 0
        },
        {
            label: 'Debbie\'s Room',
            leftIndex: 3,
            rightIndex: 12,
            onState: 0
        },
        {
            label: 'Henry\'s Room',
            leftIndex: 4,
            rightIndex: 11,
            onState: 0
        }
    ];

    let currentState,
        leftState,
        newState,
        rightState;

    return (
        <div className="relays">
            <Card color="dark">
                <CardHeader>First Floor</CardHeader>
                {firstFloorControls.map((room) => {
                    currentState = parseInt(props.relays.firstFloor, 16);
                    leftState = (currentState >> room.leftIndex) & 1;
                    rightState = (currentState >> room.rightIndex) & 1;
                    if (leftState !== rightState) {
                        leftState = 0;
                        rightState = 0;
                        newState = (currentState & ~(1 << room.leftIndex)) & (currentState & ~(1 << room.rightIndex));
                        fetch(apiBaseUrl + `/relays?floor=FIRST&value=${newState}`, { method: 'post' })
                            .then(response => console.log(response), error => console.log(error));
                    }

                    const onclickHandler = () => toggleRelayState(room.leftIndex, room.rightIndex, 'FIRST');
                    return getRelayButton(leftState === room.onState, room.label, onclickHandler);
                })}
            </Card>
            <Card color="dark">
                <CardHeader>Second Floor</CardHeader>
                {secondFloorControls.map((room, index) => {
                    currentState = parseInt(props.relays.secondFloor, 16);
                    leftState = (currentState >> room.leftIndex) & 1;
                    rightState = (currentState >> room.rightIndex) & 1;
                    if (leftState !== rightState) {
                        leftState = 0;
                        rightState = 0;
                        newState = (currentState & ~(1 << room.leftIndex)) & (currentState & ~(1 << room.rightIndex));
                        fetch(apiBaseUrl + `/relays?floor=SECOND&value=${newState}`, { method: 'post' })
                            .then(response => console.log(response), error => console.log(error));
                    }

                    const onclickHandler = () => toggleRelayState(room.leftIndex, room.rightIndex, 'SECOND');
                    return getRelayButton(leftState === room.onState, room.label, onclickHandler);
                })}
            </Card>
        </div>
    );
};
