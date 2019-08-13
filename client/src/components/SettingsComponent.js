import React, { useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';

export const Settings = (props) => {
    const [activeTab, setActiveTab] = useState('Player');

    const toggle = (selectedTab) => {
        if (activeTab !== selectedTab) {
            setActiveTab(selectedTab);
        }
    }

    return (
        <>
            <Nav tabs>
                <NavItem>
                    <NavLink
                        className={`${activeTab === 'Player' ? 'active' : null}`}
                        onClick={() => {toggle('Player');}}
                    >
                        Player
            </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={`${activeTab === 'Pandora' ? 'active' : null}`}
                        onClick={() => {toggle('Pandora')}}
                    >
                        Pandora
            </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
                <TabPane tabId="Player">
                    <Row>
                        <Col sm="12">
                            <h4>Tab 1 Contents</h4>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId="Pandora">
                    <Row>
                        <Col sm="6">
                            <Card body>
                                <CardTitle>Special Title Treatment</CardTitle>
                                <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                                <Button>Go somewhere</Button>
                            </Card>
                        </Col>
                        <Col sm="6">
                            <Card body>
                                <CardTitle>Special Title Treatment</CardTitle>
                                <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                                <Button>Go somewhere</Button>
                            </Card>
                        </Col>
                    </Row>
                </TabPane>
            </TabContent>
        </>
    )
}