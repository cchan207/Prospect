import React, { useState, useContext, useEffect } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import '../css-files/app.css';
import AppContext from '../components/context';
import { useAuth0 } from "@auth0/auth0-react";

import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import LoginButton from './loginButton';
import LogoutButton from './logoutButton';

export default function NavigationBar() {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (!isAuthenticated && isLoading) {
        return (
            <div>Loading...</div>
        )
    }

    if (isAuthenticated) {
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
                    <LogoutButton/>
                </Navbar.Collapse>
                </Navbar>
        )
    }
    else { // Not logged in
        return (
            <Navbar className="navbar" variant="dark" expand="lg">
                <Navbar.Brand href="/">PROSPECT</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                    <Nav.Link href="/about">About us</Nav.Link>
                    <NavDropdown title="Features" id="basic-nav-dropdown">
                        <NavDropdown.Item href="/home">Dashboard</NavDropdown.Item>
                        <NavDropdown.Item href="/#notes">Notes</NavDropdown.Item>
                    </NavDropdown>
                    </Nav>
                    <LoginButton/>
                </Navbar.Collapse>
                </Navbar>
        )
    }
}
