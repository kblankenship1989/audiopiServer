import React, { useState, useEffect } from 'react';
import { Form, Card, FormGroup, CardBody, CardTitle, Label, Input, Row, Button, ButtonGroup, Nav, TabContent, TabPane, NavItem, NavLink } from 'reactstrap';
import { apiBaseUrl } from '../helpers/baseUrls';
import { getNewRelayState, getRelayButton, firstFloorControls, firstFloorInputControl, secondFloorControls, secondFloorInputControl } from '../helpers/relay-helpers';

const DEFAULT_ALARM = (relays) => ({
    name: "Untitled",
    minute: "00",
    hour: "00",
    dayOfWeek: "",
    isEnabled: false,
    contextUri: "",
    relays: {
        ...relays,
        alarmOverride: true
    }
});

export const AlarmsPage = (props) => {
    const [currentAlarms, setCurrentAlarms] = useState([]);
    const [newAlarm, setNewAlarm] = useState(DEFAULT_ALARM(props.relays));
    const [playlists, setPlaylists] = useState([]);
    const [activeTab, setActiveTab] = useState('EDIT');
    const [selectedAlarm, setSelectedAlarm] = useState(null);

    const onChangeHandler = (event, field) => {
        setNewAlarm({
            ...newAlarm,
            [field]: event.target.value
        });
    }

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
            if (Number(daysOfWeekSelected[index-1]) + 1 === Number(value)) {
                if (index + 1 < daysOfWeekSelected.length && Number(daysOfWeekSelected[index+1]) - 1 === Number(value)) {
                    return ranges;
                } else {
                    return `${ranges}-${value.toString()}`;
                }
            } else {
                return `${ranges},${value.toString()}`;
            }
        }, '');
    }

    const onDayOfWeekSelect = (selected) => {
        const newDaysOfWeek = makeDayOfWeekRanges(newAlarm.dayOfWeek, selected);
        setNewAlarm({
            ...newAlarm,
            dayOfWeek: newDaysOfWeek
        });
    }

    const onRelayChange = (key, newState) => {
        setNewAlarm({
            ...newAlarm,
            relays: {
                ...newAlarm.relays,
                [key]: newState
            }
        })
    }

    const loadAlarms = () => {
        fetch(apiBaseUrl + `/alarms`, { method: 'GET' })
            .then((response) => {
                return response.json();
            })
            .then((alarms) => {
                setCurrentAlarms(alarms);
                setNewAlarm(DEFAULT_ALARM(props.relays));
                setSelectedAlarm(currentAlarms.find((alarm) => alarm.alarmId === selectedAlarm.alarmId));
            });
    }

    const addAlarm = (event) => {
        event.preventDefault();
        fetch(apiBaseUrl + `/alarms`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newAlarm),
        })
            .then(() => {
                loadAlarms();
            });
    };

    useEffect(() => {
        fetch(apiBaseUrl + `/alarms`, { method: 'GET' })
            .then((response) => {
                return response.json();
            })
            .then((alarms) => {
                setCurrentAlarms(alarms);
            })
            .catch((e) => { console.log(e) });
        fetch(apiBaseUrl + '/playback/playlists', { method: 'GET' })
            .then((response) => {
                return response.json();
            })
            .then((playlistResponse) => {
                if (playlistResponse)
                    setPlaylists(playlistResponse);
                else
                    throw new Error('No playlists returned');
            })
            .catch((e) => { console.log(e) });
    }, [])

    const updateSelectedAlarm = (alarmId) => {
        setSelectedAlarm(currentAlarms.find((alarm) => alarm.alarmId === alarmId));
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

    return (
        <>
            <Nav tabs>
                <NavItem className={'col-6'}>
                    <NavLink
                        className={activeTab === 'EDIT' ? 'active' : 'inactive'}
                        onClick={() => { setActiveTab('EDIT'); }}
                    >
                        Edit Alarm
                    </NavLink>
                </NavItem>
                <NavItem className={'col-6'}>
                    <NavLink
                        className={activeTab === 'ADD' ? 'active' : 'inactive'}
                        onClick={() => { setActiveTab('ADD'); }}
                    >
                        Add new Alarm
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
            <TabPane tabId={'EDIT'}>
                    <Form onSubmit={updateAlarm}>
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
                                        </Input>
                                    </Row>
                                </FormGroup>
                                {selectedAlarm ?
                                    <>
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
                                            className="col-md-1"
                                            type="number"
                                            min={0}
                                            max={23}
                                            name="time"
                                            id="hour"
                                            value={selectedAlarm.hour}
                                            onChange={(e) => onEditChangeHandler(e, 'hour')} />
                                        <Input
                                            className="col-md-1"
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
                                        <Label className="col-md-3" for="days">Days of the Week</Label>
                                        <ButtonGroup>
                                            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((dayOfWeek, index) => (
                                                <Button
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
                                <FormGroup>
                                    <Row>
                                        <Label className="col-md-3" for="context-uri">Playlist</Label>
                                        <Input
                                            className="col-md-3"
                                            id={'context-uri'}
                                            name={'context-uri'}
                                            onChange={(e) => onEditChangeHandler(e, 'contextUri')}
                                            value={selectedAlarm.contextUri}
                                            type={'select'}
                                        >
                                            {playlists.map((playlist) => (
                                                <option value={playlist.uri}>{playlist.name}</option>
                                            ))}
                                        </Input>
                                    </Row>
                                </FormGroup>
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
                                <p>{JSON.stringify(selectedAlarm)}</p>
                            </CardBody>
                        </Card>
                        <br />
                        <Button disabled={selectedAlarm === null} type="submit">Save Changes</Button>
                    </Form>
                </TabPane>
                <TabPane tabId={'ADD'}>
                    <Form onSubmit={addAlarm}>
                        <Card body>
                            <CardTitle>Add New Alarm</CardTitle>
                            <CardBody>
                                <FormGroup>
                                    <Row>
                                        <Label className="col-md-3" for="name">Name</Label>
                                        <Input
                                            className="col-md-3"
                                            type="text"
                                            name="name"
                                            id="name"
                                            value={newAlarm.name}
                                            onChange={(e) => onChangeHandler(e, 'name')} />
                                    </Row>
                                </FormGroup>
                                <FormGroup>
                                    <Row>
                                        <Label className="col-md-3" for="time">Time</Label>
                                        <Input
                                            className="col-md-1"
                                            type="number"
                                            min={0}
                                            max={23}
                                            name="time"
                                            id="hour"
                                            value={newAlarm.hour}
                                            onChange={(e) => onChangeHandler(e, 'hour')} />
                                        <Input
                                            className="col-md-1"
                                            type="number"
                                            min={0}
                                            max={59}
                                            name="time"
                                            id="minute"
                                            value={newAlarm.minute}
                                            onChange={(e) => onChangeHandler(e, 'minute')} />
                                    </Row>
                                </FormGroup>
                                <FormGroup>
                                    <Row>
                                        <Label className="col-md-3" for="days">Days of the Week</Label>
                                        <ButtonGroup>
                                            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((dayOfWeek, index) => (
                                                <Button
                                                    color="primary"
                                                    outline
                                                    onClick={() => onDayOfWeekSelect(index.toString())}
                                                    active={parseDaysOfWeek(newAlarm.dayOfWeek).includes(index.toString())}
                                                >
                                                    {dayOfWeek}
                                                </Button>
                                            ))}
                                        </ButtonGroup>
                                    </Row>
                                </FormGroup>
                                <FormGroup>
                                    <Row>
                                        <Label className="col-md-3" for="context-uri">Playlist</Label>
                                        <Input
                                            className="col-md-3"
                                            id={'context-uri'}
                                            name={'context-uri'}
                                            onChange={(e) => onChangeHandler(e, 'contextUri')}
                                            value={newAlarm.contextUri}
                                            type={'select'}
                                        >
                                            {playlists.map((playlist) => (
                                                <option value={playlist.uri}>{playlist.name}</option>
                                            ))}
                                        </Input>
                                    </Row>
                                </FormGroup>
                                <FormGroup>
                                    <Row>
                                        <Label className="col-md-3" for="first-floor">First Floor</Label>
                                        <ButtonGroup>
                                            {firstFloorControls.map((room) => {
                                                const currentState = parseInt(newAlarm.relays.firstFloorRelayState, 16);
                                                const leftState = (currentState >> room.leftIndex) & 1;
                                                const rightState = (currentState >> room.rightIndex) & 1;
                                                const onclickHandler = () => onRelayChange('firstFloorRelayState', getNewRelayState(newAlarm.relays.firstFloorRelayState, room.leftIndex, room.rightIndex));
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
                                                const currentState = parseInt(newAlarm.relays.secondFloorRelayState, 16);
                                                const leftState = (currentState >> room.leftIndex) & 1;
                                                const rightState = (currentState >> room.rightIndex) & 1;
                                                const onclickHandler = () => onRelayChange('secondFloorRelayState', getNewRelayState(newAlarm.relays.secondFloorRelayState, room.leftIndex, room.rightIndex));
                                                return getRelayButton((leftState & rightState) === room.onState, room.label, onclickHandler, false);
                                            })}
                                        </ButtonGroup>
                                    </Row>
                                </FormGroup>
                                <FormGroup>
                                    <Button
                                        color="primary"
                                        outline
                                        onClick={() => setNewAlarm({ ...newAlarm, isEnabled: !newAlarm.isEnabled })}
                                        active={newAlarm.isEnabled}
                                    >
                                        {newAlarm.isEnabled ? 'Enabled' : 'Disabled'}
                                    </Button>
                                </FormGroup>
                                <p>{JSON.stringify(newAlarm)}</p>
                            </CardBody>
                        </Card>
                        <br />
                        <Button type="submit">Create New Alarm</Button>
                    </Form>
                </TabPane>
            </TabContent>
        </>
    )
}