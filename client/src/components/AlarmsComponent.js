import React, { useState, useEffect } from 'react';
import { Form, Card, FormGroup, CardBody, CardTitle, Label, Input, Row, Button, ButtonGroup} from 'reactstrap';
import { apiBaseUrl } from '../helpers/baseUrls';
import { getNewRelayState, getRelayButton, firstFloorControls, secondFloorControls } from '../helpers/relay-helpers';
import { PlaylistSelect } from './PlaylistSelect';

const DEFAULT_ALARM = (relays) => ({
    alarmId: 'add-new',
    name: "Untitled",
    minute: "00",
    hour: "00",
    dayOfWeek: "",
    isEnabled: false,
    contextUri: "",
    timeoutInMinutes: 0,
    relays: {
        ...relays,
        alarmOverride: true
    }
});

export const AlarmsPage = (props) => {
    const [currentAlarms, setCurrentAlarms] = useState([]);
    const [selectedAlarm, setSelectedAlarm] = useState(null);

    const makeDayOfWeekRanges = (daysOfWeek, selected) => {
        if (!daysOfWeek) {
            return selected;
        }

        const daysOfWeekSelected = parseDaysOfWeek(daysOfWeek);
        const indexOfSelected = daysOfWeekSelected.indexOf(selected);
        if (indexOfSelected < 0) {
            daysOfWeekSelected.push(selected);
            daysOfWeekSelected.sort();
        } else {
            daysOfWeekSelected.splice(indexOfSelected, 1);
        }

        return daysOfWeekSelected.reduce((ranges, value, index) => {
            if (!ranges) {
                return value;
            }
            if (Number(daysOfWeekSelected[index - 1]) + 1 === Number(value)) {
                if (index + 1 < daysOfWeekSelected.length && Number(daysOfWeekSelected[index + 1]) - 1 === Number(value)) {
                    return ranges;
                } else {
                    return `${ranges}-${value.toString()}`;
                }
            } else {
                return `${ranges},${value.toString()}`;
            }
        }, '');
    }

    const loadAlarms = () => {
        fetch(apiBaseUrl + `/alarms`, { method: 'GET' })
            .then((response) => {
                return response.json();
            })
            .then((alarms) => {
                setCurrentAlarms(alarms);
                setSelectedAlarm(alarms.find((alarm) => alarm.alarmId === selectedAlarm.alarmId));
            });
    }

    useEffect(() => {
        fetch(apiBaseUrl + `/alarms`, { method: 'GET' })
            .then((response) => {
                return response.json();
            })
            .then((alarms) => {
                setCurrentAlarms(alarms);
            })
            .catch((e) => { console.log(e) });
    }, [])

    const updateSelectedAlarm = (alarmId) => {
        if (alarmId === 'add-new') {
            setSelectedAlarm(DEFAULT_ALARM(props.relays));
        } else {
            setSelectedAlarm(currentAlarms.find((alarm) => alarm.alarmId === alarmId));
        }
    };

    const onEditChangeHandler = (event, field) => {
        setSelectedAlarm({
            ...selectedAlarm,
            [field]: event.target.value
        });
    }

    const onEditDayOfWeekSelect = (selected) => {
        const newDaysOfWeek = makeDayOfWeekRanges(selectedAlarm.dayOfWeek, selected);
        setSelectedAlarm({
            ...selectedAlarm,
            dayOfWeek: newDaysOfWeek
        });
    }

    const onEditRelayChange = (key, newState) => {
        setSelectedAlarm({
            ...selectedAlarm,
            relays: {
                ...selectedAlarm.relays,
                [key]: newState
            }
        })
    }

    const addAlarm = (event) => {
        event.preventDefault();
        fetch(apiBaseUrl + `/alarms`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(selectedAlarm),
        })
            .then(() => {
                loadAlarms();
            });
    };

    const updateAlarm = (event) => {
        event.preventDefault();
        fetch(apiBaseUrl + `/alarms/${selectedAlarm.alarmId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(selectedAlarm),
        })
            .then(() => {
                return loadAlarms();
            });
    };

    const parseDaysOfWeek = (daysOfWeek) => {
        const days = [];
        const ranges = daysOfWeek.split(',');
        ranges.forEach((range) => {
            const rangeMinMax = range.split('-');
            if (rangeMinMax.length === 1) {
                days.push(range);
            } else {
                for (let i = Number(rangeMinMax[0]); i <= Number(rangeMinMax[1]); i++) {
                    days.push(i.toString());
                }
            }
        });

        return days;
    }

    const onSubmit = (event) => {
        if (selectedAlarm.alarmId === 'add-new') {
            addAlarm(event);
        } else {
            updateAlarm(event);
        }
    }

    const onCancelNext = (event) => {
        event.preventDefault();
        fetch(apiBaseUrl + `/alarms/${selectedAlarm.alarmId}/cancelNext`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(selectedAlarm),
        })
        .then((response) => {
            return response.json();
        })
        .then(({nextInvocation}) => {
            setSelectedAlarm({
                ...selectedAlarm,
                nextActivation: nextInvocation
            });
            const newAlarms = [...currentAlarms];
            newAlarms.forEach((alarm) => {
                if(alarm.alarmId === selectedAlarm.alarmId) {
                    alarm.nextActivation = nextInvocation;
                }
            });
            setCurrentAlarms(newAlarms);
        })
    }

    return (
        <Form onSubmit={onSubmit}>
            <Card body>
                <CardTitle>Edit Alarm</CardTitle>
                <CardBody>
                    <FormGroup>
                        <Row>
                            <Label className="col-md-3" for="alarm-select">Select Alarm</Label>
                            <Input
                                className="col-md-3"
                                id={'alarm-select'}
                                name={'alarm-select'}
                                onChange={(e) => updateSelectedAlarm(e.target.value)}
                                value={selectedAlarm ? selectedAlarm.alarmId : 'select'}
                                type={'select'}
                            >
                                <option value={'select'}>Select Alarm</option>
                                {currentAlarms.map((alarm) => (
                                    <option value={alarm.alarmId}>{alarm.name}</option>
                                ))}
                                <option value={'add-new'}>Add New Alarm</option>
                            </Input>
                        </Row>
                    </FormGroup>
                    {selectedAlarm ?
                        <>
                            {selectedAlarm.nextActivation ?
                            <FormGroup>
                                <Row>
                                    <Label className="col-md-3" for="name">Next Run Time</Label>
                                    <span className="col-md-3">{(new Date(selectedAlarm.nextActivation)).toLocaleString()}</span>
                                    <Button
                                        className="col-md-2" 
                                        color="primary"
                                        outline
                                        onClick={onCancelNext}
                                        active={true}
                                    >
                                        Cancel Next Run
                                    </Button>
                                </Row>
                            </FormGroup>
                            : null}
                            <FormGroup>
                                <Row>
                                    <Label className="col-md-3" for="name">New Name</Label>
                                    <Input
                                        className="col-md-3"
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={selectedAlarm.name}
                                        onChange={(e) => onEditChangeHandler(e, 'name')} />
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Label className="col-md-3" for="time">Time</Label>
                                    <Input
                                        className="col-md-1 col-6"
                                        type="number"
                                        min={0}
                                        max={23}
                                        name="time"
                                        id="hour"
                                        value={selectedAlarm.hour}
                                        onChange={(e) => onEditChangeHandler(e, 'hour')} />
                                    <Input
                                        className="col-md-1 col-6"
                                        type="number"
                                        min={0}
                                        max={59}
                                        name="time"
                                        id="minute"
                                        value={selectedAlarm.minute}
                                        onChange={(e) => onEditChangeHandler(e, 'minute')} />
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Label className="col-md-3" for="timeout">{'Timeout (in Minutes)'}</Label>
                                    <Input
                                        className="col-md-3"
                                        type="number"
                                        min="0"
                                        max="120"
                                        name="timeout"
                                        id="timeout"
                                        value={selectedAlarm.timeoutInMinutes || 0}
                                        onChange={(e) => onEditChangeHandler(e, 'timeoutInMinutes')} />
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Label className="col-md-3" for="days">Days of the Week</Label>
                                    <ButtonGroup>
                                        {['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'].map((dayOfWeek, index) => (
                                            <Button
                                                className='col-2'
                                                color="primary"
                                                outline
                                                onClick={() => onEditDayOfWeekSelect(index.toString())}
                                                active={parseDaysOfWeek(selectedAlarm.dayOfWeek).includes(index.toString())}
                                            >
                                                {dayOfWeek}
                                            </Button>
                                        ))}
                                    </ButtonGroup>
                                </Row>
                            </FormGroup>
                            <PlaylistSelect currentValue={selectedAlarm.contextUri} onSelect={(e) => onEditChangeHandler(e, 'contextUri')}/>
                            <FormGroup>
                                <Row>
                                    <Label className="col-md-3" for="first-floor">First Floor</Label>
                                    <ButtonGroup>
                                        {firstFloorControls.map((room) => {
                                            const currentState = parseInt(selectedAlarm.relays.firstFloorRelayState, 16);
                                            const leftState = (currentState >> room.leftIndex) & 1;
                                            const rightState = (currentState >> room.rightIndex) & 1;
                                            const onclickHandler = () => onEditRelayChange('firstFloorRelayState', getNewRelayState(selectedAlarm.relays.firstFloorRelayState, room.leftIndex, room.rightIndex));
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
                                            const currentState = parseInt(selectedAlarm.relays.secondFloorRelayState, 16);
                                            const leftState = (currentState >> room.leftIndex) & 1;
                                            const rightState = (currentState >> room.rightIndex) & 1;
                                            const onclickHandler = () => onEditRelayChange('secondFloorRelayState', getNewRelayState(selectedAlarm.relays.secondFloorRelayState, room.leftIndex, room.rightIndex));
                                            return getRelayButton((leftState & rightState) === room.onState, room.label, onclickHandler, false);
                                        })}
                                    </ButtonGroup>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Button
                                    color="primary"
                                    outline
                                    onClick={() => setSelectedAlarm({ ...selectedAlarm, isEnabled: !selectedAlarm.isEnabled })}
                                    active={selectedAlarm.isEnabled}
                                >
                                    {selectedAlarm.isEnabled ? 'Enabled' : 'Disabled'}
                                </Button>
                            </FormGroup>
                        </> : null}
                </CardBody>
            </Card>
            <br />
            <Button disabled={selectedAlarm === null} type="submit">Save Changes</Button>
        </Form>
    )
}