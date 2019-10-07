import React, { useState } from 'react';
import * as ReactStrap from 'reactstrap';
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
            <ReactStrap.Nav tabs>
                <ReactStrap.NavItem>
                    <ReactStrap.NavLink
                        className={`${activeTab === 'Player' ? 'active' : null}`}
                        onClick={() => {toggle('Player');}}
                    >
                        Player
                    </ReactStrap.NavLink>
                </ReactStrap.NavItem>
                <ReactStrap.NavItem>
                    <ReactStrap.NavLink
                        className={`${activeTab === 'Pandora' ? 'active' : null}`}
                        onClick={() => {toggle('Pandora')}}
                    >
                        Pandora
                    </ReactStrap.NavLink>
                </ReactStrap.NavItem>
                <ReactStrap.NavItem>
                    <ReactStrap.NavLink
                        className={`${activeTab === 'Alarm' ? 'active' : null}`}
                        onClick={() => {toggle('Alarm')}}
                    >
                        Alarm
                    </ReactStrap.NavLink>
                </ReactStrap.NavItem>
            </ReactStrap.Nav>
            <ReactStrap.TabContent activeTab={activeTab}>
                <ReactStrap.TabPane tabId="Player">
                    <ReactStrap.Row>
                        <ReactStrap.Col sm="12">
                            <h4>Tab 1 Contents</h4>
                        </ReactStrap.Col>
                    </ReactStrap.Row>
                </ReactStrap.TabPane>
                <ReactStrap.TabPane tabId="Pandora">
                    <ReactStrap.Row>
                        <ReactStrap.Col>
                            <ReactStrap.Card body>
                                <ReactStrap.CardTitle>Pandora Configurations</ReactStrap.CardTitle>
                                <ReactStrap.Form>
                                    <ReactStrap.FormGroup>
                                        <ReactStrap.Label for="username">Username</ReactStrap.Label>
                                        <ReactStrap.Input type="text" name="username" id="username" placeholder="Pandora Account UserName" />
                                    </ReactStrap.FormGroup>
                                    <ReactStrap.FormGroup>
                                        <ReactStrap.Label for="password">Password</ReactStrap.Label>
                                        <ReactStrap.Input type="password" name="password" id="password" />
                                    </ReactStrap.FormGroup>
                                    <ReactStrap.FormGroup>
                                        <ReactStrap.Label for="username">Station on Start</ReactStrap.Label>
                                        <StationSelect />
                                    </ReactStrap.FormGroup>
                                    <ReactStrap.Button>Save Settings</ReactStrap.Button>
                                </ReactStrap.Form>
                            </ReactStrap.Card>
                        </ReactStrap.Col>
                    </ReactStrap.Row>
                </ReactStrap.TabPane>
            </ReactStrap.TabContent>
        </>
    )
}