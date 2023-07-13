import React, { useState, useEffect } from 'react';
import {Form, Card, FormGroup, CardBody, CardTitle, Label, Input, Row, Button} from 'reactstrap';
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
            <br />
            <Button type="submit">Save Settings</Button>
        </Form>
    )
}