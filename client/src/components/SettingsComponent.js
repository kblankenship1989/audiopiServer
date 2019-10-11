import React, { useState } from 'react';
import {Form, Card, FormGroup, CardBody, CardTitle, Label, Input, Row, Col, Button} from 'reactstrap';
import Select from 'react-select';
import { StationSelect } from './StationsComponent';

export const Settings = (props) => {
    const [activeTab, setActiveTab] = useState('Player');

    const toggle = (selectedTab) => {
        if (activeTab !== selectedTab) {
            setActiveTab(selectedTab);
        }
    }

    return (
        <>
            <Form>
                <Card body>
                    <CardTitle>Player Configurations</CardTitle>
                    <CardBody>
                        <FormGroup>
                            <Row>
                                <Label className="col-md-3" for="defaultVolume">Default Volume (dB)</Label>
                                <Input className="col-md-2" type="number" min={-30} max={+5} step={0.5} name="defaultVolume" id="defaultVolume"/>
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            <Row>
                                <Label className="col-md-3" for="quality">Audio Quality</Label>
                                <Select
                                    className="col-md-2 form-select"
                                    value={'high'}
                                    options={[
                                        {
                                            label: 'high',
                                            value: 'high'
                                        },
                                        {
                                            label: 'low',
                                            value: 'low'
                                        }
                                    ]}/>
                                </Row>
                        </FormGroup>
                    </CardBody>
                </Card>
                <br />
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
                        {/* <FormGroup>
                            <Label for="defaultstation">Station on Start</Label>
                            <StationSelect id="defaultstation" name="defaultstation"/>
                        </FormGroup> */}
                        <FormGroup>
                            <Label for="history">Song History Size</Label>
                            <Input type="number" min={0} max={15} step={1} name="history" id="history"/>
                        </FormGroup>
                    </CardBody>
                </Card>
                <br />
                <Button type="submit">Save Settings</Button>
            </Form>
        </>
    )
}