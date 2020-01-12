import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup, Nav, NavItem, NavLink, TabPane, TabContent } from 'reactstrap';
import { apiBaseUrl } from '../helpers/baseUrls';

export const RelayComponent = (props) => {
    const [activeTab, setActiveTab] = useState('FirstFloor');

    const toggleTab = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    const disableAlarmOverride = () => {
        fetch(apiBaseUrl + `/relays?key=ALARM`, { method: 'POST' });
    }

    const toggleRelayState = (leftIndex, rightIndex, floor) => {
        let currentState,
            newState;

        if (floor === 'FIRST') {
            currentState = parseInt(props.firstFloorRelayState, 16);
        } else if (floor === 'SECOND') {
            currentState = parseInt(props.secondFloorRelayState, 16);
        } else {
            return;
        }

        const leftState = (currentState >> leftIndex) & 1;
        const rightState = (currentState >> rightIndex) & 1;
        const testIndex = (1 << leftIndex) | (1 << rightIndex);

        if (leftState === rightState) {
            newState = currentState ^ testIndex;
        } else {
            newState = currentState | testIndex;
        }
        fetch(apiBaseUrl + `/relays?key=${floor}&value=${newState.toString(16)}`, { method: 'POST' });
    }

    const getRelayButton = (state, label, clickHandler, block) => {
        return (
            <Button
                block={block}
                color={state ? 'success' : 'danger'}
                onClick={clickHandler}>
                {label}
            </Button>
        )
    }

    const firstFloorControls = [
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

    const firstFloorInputControl = [
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

    const secondFloorControls = [
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

    const secondFloorInputControl = [
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

    let currentState,
        leftState,
        rightState;

    return (
        <div className="relays">
            {props.alarmOverride ? 
                <Button onClick={disableAlarmOverride}>
                    {'Disable Alarm Override'}
                </Button>
            :
                <>
                    <Nav tabs>
                        <NavItem className={'col-6'}>
                            <NavLink
                                className={activeTab === 'FirstFloor' ? 'active' : 'inactive'}
                                onClick={() => { toggleTab('FirstFloor'); }}
                            >
                                First Floor
                            </NavLink>
                        </NavItem>
                        <NavItem className={'col-6'}>
                            <NavLink
                                className={activeTab === 'SecondFloor' ? 'active' : 'inactive'}
                                onClick={() => { toggleTab('SecondFloor'); }}
                            >
                                Second Floor
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={activeTab}>
                        <TabPane tabId={'FirstFloor'}>
                            <h4>Audio Source</h4>
                            <ButtonGroup className={'audio-source'}>
                                {firstFloorInputControl.map((input) => {
                                    currentState = parseInt(props.firstFloorRelayState, 16);
                                    leftState = (currentState >> input.leftIndex) & 1;
                                    rightState = (currentState >> input.rightIndex) & 1;
                                    const onclickHandler = () => toggleRelayState(input.leftIndex, input.rightIndex, 'FIRST');
                                    return getRelayButton((leftState & rightState) === input.onState, input.label, onclickHandler, false);
                                })}
                            </ButtonGroup>
                            <hr/>
                            <h4>Rooms</h4>
                            {firstFloorControls.map((room) => {
                                currentState = parseInt(props.firstFloorRelayState, 16);
                                leftState = (currentState >> room.leftIndex) & 1;
                                rightState = (currentState >> room.rightIndex) & 1;
                                const onclickHandler = () => toggleRelayState(room.leftIndex, room.rightIndex, 'FIRST');
                                return getRelayButton((leftState & rightState) === room.onState, room.label, onclickHandler, true);
                            })}
                            <br/>
                        </TabPane>
                        <TabPane tabId={'SecondFloor'}>
                        <h4>Audio Source</h4>
                            <ButtonGroup className={'audio-source'}>
                                {secondFloorInputControl.map((input) => {
                                    currentState = parseInt(props.secondFloorRelayState, 16);
                                    leftState = (currentState >> input.leftIndex) & 1;
                                    rightState = (currentState >> input.rightIndex) & 1;
                                    const onclickHandler = () => toggleRelayState(input.leftIndex, input.rightIndex, 'SECOND');
                                    return getRelayButton((leftState & rightState) === input.onState, input.label, onclickHandler, false);
                                })}
                            </ButtonGroup>
                            <hr/>
                            <h4>Rooms</h4>
                            {secondFloorControls.map((room) => {
                                currentState = parseInt(props.secondFloorRelayState, 16);
                                leftState = (currentState >> room.leftIndex) & 1;
                                rightState = (currentState >> room.rightIndex) & 1;
                                const onclickHandler = () => toggleRelayState(room.leftIndex, room.rightIndex, 'SECOND');
                                return getRelayButton((leftState & rightState) === room.onState, room.label, onclickHandler, true);
                            })}
                            <br/>
                        </TabPane>
                    </TabContent>
                </>
            }
        </div>
    );
};

RelayComponent.propTypes = {
    firstFloorRelayState: PropTypes.string.isRequired,
    secondFloorRelayState: PropTypes.string.isRequired,
    alarmOverride: PropTypes.bool.isRequired
}
