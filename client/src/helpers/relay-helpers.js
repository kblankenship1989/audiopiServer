import { Button } from "reactstrap";
import React from 'react';

export const firstFloorControls = [
    {
        label: 'Kitchen',
        leftIndex: 11,
        rightIndex: 3,
        onState: 1
    },
    {
        label: 'Patio',
        leftIndex: 4,
        rightIndex: 12,
        onState: 1
    },
    {
        label: 'Office',
        leftIndex: 10,
        rightIndex: 2,
        onState: 1
    },
    {
        label: 'Basement',
        leftIndex: 5,
        rightIndex: 13,
        onState: 1
    }
];

export const firstFloorInputControl = [
    {
        label: 'Aux',
        leftIndex: 7,
        rightIndex: 8,
        onState: 1
    },
    {
        label: 'Pi',
        leftIndex: 7,
        rightIndex: 8,
        onState: 0
    }
];

export const secondFloorControls = [
    {
        label: 'Master Bedroom',
        leftIndex: 11,
        rightIndex: 3,
        onState: 1
    },
    {
        label: 'Master Closet',
        leftIndex: 4,
        rightIndex: 12,
        onState: 1
    },
    {
        label: 'Master Bathroom',
        leftIndex: 10,
        rightIndex: 2,
        onState: 1
    },
    {
        label: 'Debbie\'s Room',
        leftIndex: 5,
        rightIndex: 13,
        onState: 1
    },
    {
        label: 'Henry\'s Room',
        leftIndex: 9,
        rightIndex: 1,
        onState: 1
    }
];

export const secondFloorInputControl = [
    {
        label: 'Aux',
        leftIndex: 7,
        rightIndex: 8,
        onState: 1
    },
    {
        label: 'Pi',
        leftIndex: 7,
        rightIndex: 8,
        onState: 0
    }
];

export const getRelayButton = (state, label, clickHandler, block) => {
    return (
        <Button
            block={block}
            color={state ? 'success' : 'danger'}
            onClick={clickHandler}>
            {label}
        </Button>
    )
}

export const getNewRelayState = (currentState, leftIndex, rightIndex) => {
    const currentStateAsInt = parseInt(currentState, 16);

    const leftState = (currentStateAsInt >> leftIndex) & 1;
    const rightState = (currentStateAsInt >> rightIndex) & 1;
    const testIndex = (1 << leftIndex) | (1 << rightIndex);

    let newState;
    if (leftState === rightState) {
        newState = currentStateAsInt ^ testIndex;
    } else {
        newState = currentStateAsInt | testIndex;
    }

    return newState.toString(16);
}