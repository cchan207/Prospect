import React , { useEffect } from 'react';
import '../css-files/app.css';

import Container from '@material-ui/core/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import LoginButton from '../components/loginButton';
import AppContext from '../components/context';

import FullLogo from '../img/FullLogo.png';

export default function LandingPage() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div>
            <div className="login">
                <div>
                    <Container className="login-bg">
                        <div className="login-content">
                            <h1><img src={FullLogo}/></h1>
                            <h3>Welcome</h3>
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
                            <br/>
                            <span>
                                Don't have an account? <a href="/signup">Sign Up</a>
                            </span>
                        </div>
                    </Container>
                </div>
            </div>
        </div>
    )
}
