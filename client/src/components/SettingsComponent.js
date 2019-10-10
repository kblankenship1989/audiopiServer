import React, { useState } from 'react';
import * as ReactStrap from 'reactstrap';
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
            {/* <ReactStrap.Nav tabs>
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
            </ReactStrap.Nav> */}
            {/* <ReactStrap.TabContent activeTab={activeTab}>
                <ReactStrap.TabPane tabId="Player"> */}
                    <ReactStrap.Row>
                        <ReactStrap.Col>
                            <ReactStrap.Card body>
                                <ReactStrap.CardTitle>Player Configurations</ReactStrap.CardTitle>
                                <ReactStrap.Form>
                                    <ReactStrap.FormGroup>
                                        <ReactStrap.Label for="defaultVolume">Default Volume (dB)</ReactStrap.Label>
                                        <ReactStrap.Input type="number" min={-30} max={+5} step={0.5} name="defaultVolume" id="defaultVolume"/>
                                    </ReactStrap.FormGroup>
                                    <ReactStrap.FormGroup>
                                        <ReactStrap.Label for="quality">Audio Quality</ReactStrap.Label>
                                        <Select                
                                            value={'high'}
                                            options={{
                                                high: 'high',
                                                low: 'low'
                                            }}/>
                                    </ReactStrap.FormGroup>
                                    <ReactStrap.Button>Save Player Settings</ReactStrap.Button>
                                </ReactStrap.Form>
                            </ReactStrap.Card>
                        </ReactStrap.Col>
                    </ReactStrap.Row>
                {/* </ReactStrap.TabPane>
                <ReactStrap.TabPane tabId="Pandora"> */}
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
                                        <ReactStrap.Label for="defaultstation">Station on Start</ReactStrap.Label>
                                        <StationSelect id="defaultstation" name="defaultstation"/>
                                    </ReactStrap.FormGroup>
                                    <ReactStrap.FormGroup>
                                        <ReactStrap.Label for="history">Song History Size</ReactStrap.Label>
                                        <ReactStrap.Input type="number" min={0} max={15} step={1} name="history" id="history"/>
                                    </ReactStrap.FormGroup>
                                    <ReactStrap.Button>Save Pandora Settings</ReactStrap.Button>
                                </ReactStrap.Form>
                            </ReactStrap.Card>
                        </ReactStrap.Col>
                    </ReactStrap.Row>
                {/* </ReactStrap.TabPane>
            </ReactStrap.TabContent> */}
        </>
    )
}