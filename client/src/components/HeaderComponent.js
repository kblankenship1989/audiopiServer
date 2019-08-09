import React from 'react';
import {Nav,NavItem,NavLink,Navbar,NavbarToggler,NavbarBrand,Collapse} from 'reactstrap';

function Header(props) {
    return(
        <>
            <Navbar dark expand="md">
                <div className="container">
                    <NavbarBrand className="mr-auto" href="/" target="_blank">
                        <img src={require('../assets/Raspi.png')} width="40" height="35" alt="" /> 
                    </NavbarBrand>
                    <NavbarToggler onClick={props.toggleNav} />
                    <Collapse isOpen={props.isNavOpen} navbar>
                        <Nav navbar>
                            <NavItem>
                                <NavLink className="nav-link" to="/home">Home</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className="nav-link" to="/pandora">Pandora</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className="nav-link" to="/iheartradio">I-Heart Radio</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className="nav-link" to="/relays">Relay Control</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className="nav-link" to="/settings">Settings</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </div>
            </Navbar>
        </>
    );
}

export default Header;