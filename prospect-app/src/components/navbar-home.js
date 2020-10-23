import React, { useState, useContext } from 'react';
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
    }


    <Nav.Link onClick={loginContext.toggleLogin}>
        {loginContext.loginState === false ? "Log in" : "Log out"}
     </Nav.Link>
    */

    return (
        <Navbar className="navbar" variant="dark" expand="lg">
            <Navbar.Brand href="/home">PROSPECT</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                <Nav.Link href="/home">Home</Nav.Link>
                <NavDropdown title="Jobs" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/add-job">Add new job</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="/about">About us</Nav.Link>
                </Nav>
                <Nav className="mr-auto" className="justify-content-end">
                    <Nav.Link href="/">Log out</Nav.Link>
                </Nav>
            </Navbar.Collapse>
            </Navbar>
    )
}
