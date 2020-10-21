import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import '../css-files/app.css';
import AppContext from '../components/context';

import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

export default function NavigationBar() {
    const loginContext = useContext(AppContext);
    /*const checkAuthHome = () => {
        loginContext.loginState === true ? window.location.href = "#home" : window.location.href = "#";
    }
    const checkAuthBrand = () => {
        loginContext.loginState === true ? window.location.href = "#home" : window.location.href = "#";
    }
    const checkAuthJob = () => {
        loginContext.loginState === true ? window.location.href = "#job" : window.location.href = "#";
    }*/

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/">PROSPECT</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                <Nav.Link>About us</Nav.Link>
                <NavDropdown title="Features" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#">Dashboard</NavDropdown.Item>
                    <NavDropdown.Item href="#">Notes</NavDropdown.Item>
                </NavDropdown>
                </Nav>
                <Nav className="mr-auto" className="justify-content-end">
                    <Nav.Link onClick={loginContext.toggleLogin}>
                        {loginContext.loginState === false ? "Log in" : "Log out"}
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
            </Navbar>
    )
}