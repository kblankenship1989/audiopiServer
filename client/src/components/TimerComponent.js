import React, { useState, useEffect } from 'react';
import { Form, Card, FormGroup, CardBody, CardTitle, Label, Input, Row, Button, ButtonGroup} from 'reactstrap';
import { getNewRelayState, getRelayButton, firstFloorControls, secondFloorControls } from '../helpers/relay-helpers';
import { PlaylistSelect } from './PlaylistSelect';
import { apiBaseUrl } from '../helpers/baseUrls';

const DEFAULT_STATE = (relays) => ({
    contextUri: '',
    timeoutInMinutes: 0,
    startSongIndex: 0,
    shuffleState: false,
    relays
});

export const TimerPage = ({relays}) => {
    const [selections, setSelections] = useState(DEFAULT_STATE(relays));
    const onSubmit = (e) => {
        e.preventDefault();
        fetch(apiBaseUrl + `/timer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(selections),
        })
            .then(() => {
                setSelections(DEFAULT_STATE(relays));
            });
    }

    const onEditRelayChange = (key, newState) => {
        setSelections({
            ...selections,
            relays: {
                ...selections.relays,
                [key]: newState
            }
        })
    }

    return (
        <Form onSubmit={onSubmit}>
            <Card body>
                <CardTitle>Player Configurations</CardTitle>
                <CardBody>
                    <PlaylistSelect
                        onSelect={(e, key) => setSelections({...selections, [key]: e.target.value})}
                        playlistUri={selections.contextUri}
                        shuffleState={selections.shuffleState}
                        startSongIndex={selections.startSongIndex}
                    />
                    <FormGroup>
                        <Row>
                            <Label className="col-md-3" for="timeout">{'Duration (in Minutes)'}</Label>
                            <Input
                                className="col-md-3"
                                type="number"
                                min="0"
                                max="120"
                                name="timeout"
                                id="timeout"
                                value={selections.timeoutInMinutes || 0}
                                onChange={(e) => setSelections({...selections, timeoutInMinutes: e.target.value})} />
                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <Row>
                            <Label className="col-md-3" for="first-floor">First Floor</Label>
                            <ButtonGroup>
                                {firstFloorControls.map((room) => {
                                    const currentState = parseInt(selections.relays.firstFloorRelayState, 16);
                                    const leftState = (currentState >> room.leftIndex) & 1;
                                    const rightState = (currentState >> room.rightIndex) & 1;
                                    const onclickHandler = () => onEditRelayChange('firstFloorRelayState', getNewRelayState(selections.relays.firstFloorRelayState, room.leftIndex, room.rightIndex));
                                    return getRelayButton((leftState & rightState) === room.onState, room.label, onclickHandler, false);
                                })}
                            </ButtonGroup>
                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <Row>
                            <Label className="col-md-3" for="second-floor">Second Floor</Label>
                            <ButtonGroup>
                                {secondFloorControls.map((room) => {
                                    const currentState = parseInt(selections.relays.secondFloorRelayState, 16);
                                    const leftState = (currentState >> room.leftIndex) & 1;
                                    const rightState = (currentState >> room.rightIndex) & 1;
                                    const onclickHandler = () => onEditRelayChange('secondFloorRelayState', getNewRelayState(selections.relays.secondFloorRelayState, room.leftIndex, room.rightIndex));
                                    return getRelayButton((leftState & rightState) === room.onState, room.label, onclickHandler, false);
                                })}
                            </ButtonGroup>
                        </Row>
                    </FormGroup>
                </CardBody>
            </Card>
            <br />
            <Button type="submit">Start Timer</Button>
        </Form>
    )
}