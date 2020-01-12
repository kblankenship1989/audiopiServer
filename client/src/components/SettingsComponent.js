import React, { useState, useEffect } from 'react';
import {Form, Card, FormGroup, CardBody, CardTitle, Label, Input, Row, Col, Button} from 'reactstrap';
import Select from 'react-select';
import { StationSelect } from './StationsComponent';
import { apiBaseUrl } from '../helpers/baseUrls';

export const SettingsPage = (props) => {
    const [currentSettings, setCurrentSettings] = useState({
        ...props.settings
    })

    const changeHandler = (event, setting) => {
        setCurrentSettings({
            ...currentSettings,
            [setting]: event.target.value
        });
    }

    const submitForm = (event) => {
        event.preventDefault();
        fetch(apiBaseUrl + `/settings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(currentSettings),
        })
            .then(() => {
                props.updateSettings(currentSettings);
            });
    };

    useEffect(() => {
        fetch(apiBaseUrl + `/settings`, { method: 'GET' })
            .then((response) => {
                return response.json();
            })
            .then((settings) => {
                setCurrentSettings(settings);
                props.updateSettings(settings);
            });
    }, [])

    return (
        <Form onSubmit={submitForm}>
            <Card body>
                <CardTitle>Player Configurations</CardTitle>
                <CardBody>
                    <FormGroup>
                        <Row>
                            <Label className="col-md-3" for="defaultVolume">Default Volume (%)</Label>
                            <Input 
                                className="col-md-2" 
                                type="number" 
                                min={0} 
                                max={100} 
                                step={1}
                                name="defaultVolume" 
                                id="defaultVolume"
                                value={currentSettings.defaultVolume}
                                onChange={(e) => changeHandler(e, 'defaultVolume')}/>
                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <Row>
                            <Label className="col-md-3" for="timeoutInMinutes">Player Timeout</Label>
                            <Input
                                className="col-md-2" 
                                type="number" 
                                min={0} 
                                name="timeoutInMinutes" 
                                id="timeoutInMinutes"
                                value={currentSettings.timeoutInMinutes}
                                onChange={(e) => changeHandler(e, 'timeoutInMinutes')}/>
                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <Row>
                            <Label className="col-md-3" for="closeTimeoutInMinutes">Shutdown Timeout</Label>
                            <Input 
                                className="col-md-2" 
                                type="number" 
                                min={0} 
                                name="closeTimeoutInMinutes" 
                                id="closeTimeoutInMinutes"
                                value={currentSettings.closeTimeoutInMinutes}
                                onChange={(e) => changeHandler(e, 'closeTimeoutInMinutes')}/>
                        </Row>
                    </FormGroup>
                </CardBody>
            </Card>
            {/* <br />
            <Card body>
                <CardTitle>Pandora Configurations</CardTitle>
                <CardBody>
                    <FormGroup>
                        <Label for="username">Username</Label>
                        <Input type="text" name="username" id="username" placeholder="Pandora Account UserName" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Input type="password" name="password" id="password" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="defaultstation">Station on Start</Label>
                        <StationSelect id="defaultstation" name="defaultstation"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="history">Song History Size</Label>
                        <Input type="number" min={0} max={15} step={1} name="history" id="history"/>
                    </FormGroup>
                </CardBody>
            </Card> */}
            <br />
            <Button type="submit">Save Settings</Button>
        </Form>
    )
}