import React, { useState, useContext } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import '../css-files/app.css';
import AppContext from '../components/context';

import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import LoginButton from './loginButton';

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
        <Navbar className="navbar" variant="dark" expand="lg">
            <Navbar.Brand href="/">PROSPECT</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                <Nav.Link href="/about">About us</Nav.Link>
                <NavDropdown title="Features" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/#dashboard">Dashboard</NavDropdown.Item>
                    <NavDropdown.Item href="/#notes">Notes</NavDropdown.Item>
                </NavDropdown>
                </Nav>
                <LoginButton/>
                {/* <Nav className="mr-auto" className="justify-content-end">
                    <Nav.Link href="/login">Log in</Nav.Link>
                </Nav> */}
            </Navbar.Collapse>
            </Navbar>
    )
}
