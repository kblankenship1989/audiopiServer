import React from 'react';
import {Nav,NavItem,NavLink,Navbar,NavbarToggler,NavbarBrand,Collapse} from 'reactstrap';
import {NavLink as RRNavLink} from 'react-router-dom';

function Header(props) {
    return(
        <>
            <Navbar dark expand="md">
                <div className="container">
                    <NavbarBrand className="mr-auto" to="/" target="_blank" tag={RRNavLink}>
                        <img src={`${process.env.PUBLIC_URL}/assets/Raspi.png`} width="40" height="35" alt="" /> 
                    </NavbarBrand>
                    <NavbarToggler onClick={props.toggleNav} />
                    <Collapse isOpen={props.isNavOpen} navbar>
                        <Nav navbar>
                            <NavItem>
                                <NavLink tag={RRNavLink} className="nav-link" to="/home" onClick={props.toggleNav}>Home</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={RRNavLink} className="nav-link" to="/relays" onClick={props.toggleNav}>Room Control</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={RRNavLink} className="nav-link" to="/alarms" onClick={props.toggleNav}>Alarms</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={RRNavLink} className="nav-link" to="/timer" onClick={props.toggleNav}>Timer</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </div>
            </Navbar>
        </>
    );
}

export default Header;