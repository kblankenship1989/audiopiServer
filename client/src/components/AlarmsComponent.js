import React, { useState, useEffect } from 'react';
import {Form, Card, FormGroup, CardBody, CardTitle, Label, Input, Row, Button, ButtonGroup} from 'reactstrap';
import { apiBaseUrl } from '../helpers/baseUrls';

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

    const onChangeHandler = (event, field) => {
        setNewAlarm({
            ...newAlarm,
            [field]: event.target.value
        });
    }

    const onDayOfWeekSelect = (selected) => {
        if (!newAlarm.dayOfWeek) {
            setNewAlarm({
                ...newAlarm,
                dayOfWeek: selected
              });
        } else {
            const daysOfWeekSelected = newAlarm.dayOfWeek.split(',');
            const indexOfSelected = daysOfWeekSelected.indexOf(selected);
            if (indexOfSelected < 0) {
                daysOfWeekSelected.push(selected);
            } else {
                daysOfWeekSelected.splice(indexOfSelected, 1);
            }
            setNewAlarm({
                ...newAlarm,
                dayOfWeek: daysOfWeekSelected.join(',')
            });
        }
    }

    const loadAlarms = () => {
        fetch(apiBaseUrl + `/alarms`, { method: 'GET' })
            .then((response) => {
                return response.json();
            })
            .then((alarms) => {
                setCurrentAlarms(alarms);
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
                setNewAlarm(DEFAULT_ALARM(props.relays));
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
            .catch((e) => {console.log(e)});
        fetch(apiBaseUrl + '/playback/playlists', {method: 'GET'})
            .then((response) => {
                return response.json();
            })
            .then((playlistResponse) => {
                if (playlistResponse)
                    setPlaylists(playlistResponse);
                else
                    throw new Error('No playlists returned');
            })
            .catch((e) => {console.log(e)});
    }, [])

    return (
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
                                onChange={(e) => onChangeHandler(e, 'name')}/>
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
                                onChange={(e) => onChangeHandler(e, 'hour')}/>
                            <Input
                                className="col-md-1" 
                                type="number"
                                min={0}
                                max={59}
                                name="time" 
                                id="minute"
                                value={newAlarm.minute}
                                onChange={(e) => onChangeHandler(e, 'minute')}/>
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
                                        active={newAlarm.dayOfWeek.split(',').includes(index.toString())}
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
                        <Button
                            color="primary"
                            outline
                            onClick={() => setNewAlarm({...newAlarm, isEnabled: !newAlarm.isEnabled})}
                            active={newAlarm.isEnabled}
                        >
                            {newAlarm.isEnabled ? 'Enabled' : 'Disabled'}
                        </Button>
                    </FormGroup>
                    <p>{JSON.stringify(newAlarm)}</p>
                    <p>{JSON.stringify(currentAlarms)}</p>
                </CardBody>
            </Card>
            <br />
            <Button type="submit">Create New Alarm</Button>
        </Form>
    )
}