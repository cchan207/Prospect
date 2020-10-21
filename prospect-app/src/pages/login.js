import React , { useEffect } from 'react';
import '../css-files/app.css';

import Navbar from '../components/navbar';
import Container from '@material-ui/core/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import LoginButton from '../components/loginButton';


export default function LandingPage() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div>
            <Navbar />
            <div className="login">
                <div>
                    <Container className="login-bg">
                        <div className="login-content">
                            <h1 className="login-h1">Welcome</h1>
                            <Form className="login-form">
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" />
                            </Form.Group>
                            </Form>
                            <LoginButton/>
                            <p>
                                Don't have an account? Sign Up
                            </p>
                        </div>
                    </Container>
                </div>
            </div>
        </div>
    )
}
