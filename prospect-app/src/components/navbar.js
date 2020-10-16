import React, { useState, useContext } from 'react';
import '../css-files/app.css';
import AppContext from '../components/context';

import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

export default function NavigationBar() {
    /*const [login, setLogin] = useState(false); // not logged in initially

    const toggleLogin = () => {
        setLogin(!login);
        login === false ? window.location.href = "#home" : window.location.href = "#";
    }*/

    const loginContext = useContext(AppContext);

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#">PROSPECT</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                <Nav.Link href="#home">Home</Nav.Link>
                <NavDropdown title="Jobs" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#job">Dashboard</NavDropdown.Item>
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