import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup, Nav, NavItem, NavLink, TabPane, TabContent } from 'reactstrap';
import { apiBaseUrl } from '../helpers/baseUrls';
import {getNewRelayState, getRelayButton, firstFloorControls, firstFloorInputControl, secondFloorControls, secondFloorInputControl} from '../helpers/relay-helpers';

export const RelayComponent = (props) => {
    const [activeTab, setActiveTab] = useState('FirstFloor');

    const toggleTab = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    const disableAlarmOverride = () => {
        fetch(apiBaseUrl + `/relays?key=ALARM`, { method: 'POST' });
    }

    const toggleRelayState = (leftIndex, rightIndex, floor) => {
        let newState;

        if (floor === 'FIRST') {
            newState = getNewRelayState(props.firstFloorRelayState, leftIndex, rightIndex);
        } else if (floor === 'SECOND') {
            newState = getNewRelayState(props.secondFloorRelayState, leftIndex, rightIndex);
        } else {
            return;
        }

        fetch(apiBaseUrl + `/relays?key=${floor}&value=${newState}`, { method: 'POST' });
    }

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
