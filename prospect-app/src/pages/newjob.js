import React , { useEffect, useState } from 'react';
import '../css-files/app.css';
import axios from 'axios';

import Container from '@material-ui/core/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import LoginButton from '../components/loginButton';
import AppContext from '../components/context';

import Navbar from '../components/navbar-lp';

export default function LandingPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const activateButton = () => {
        console.log(firstName)
        console.log(lastName)
        console.log(email)

        const urlLink = "http://127.0.0.1:5000/api/v1/add/user";

        const res = axios.post(urlLink, `FirstName=${firstName}&LastName=${lastName}&Email=${email}`);
        return res.form;

    }

    const handleFirstName = (e) => {
      setFirstName(e.target.value);
    }

    const handleLastName = (e) => {
      setLastName(e.target.value);
    }

    const handleEmail = (e) => {
      setEmail(e.target.value);
    }

    return (
      <div>
          <Navbar />
            <Container className="addUser-bg">
              <Form>
              <Form.Group onChange={handleFirstName} value={firstName}>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="textarea" placeholder="First Name" />
              </Form.Group>
              <Form.Group onChange={handleLastName} value={lastName}>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="textarea" placeholder="Last Name" />
              </Form.Group>
              <Form.Group onChange={handleEmail} value={email}>
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="textarea" placeholder="Email" />
              </Form.Group>
              </Form>
              <Button variant="primary" type="submit" onClick={activateButton}>SUBMIT</Button>
            </Container>
      </div>
    )
}





// code for later when we have them enter an application
// <div>
//     <Navbar />
//       <Container className="addJob-bg">
//         <Form className="add-job">
//         <Form.Group controlId="formPositionTitle">
//             <Form.Label>Position Title</Form.Label>
//             <Form.Control type="textarea" placeholder="Position Title" />
//         </Form.Group>
//         <Form.Group controlId="formApplicationLink">
//             <Form.Label>Application Link</Form.Label>
//             <Form.Control type="textarea" placeholder="Application Link" />
//         </Form.Group>
//         <Form.Group controlId="formApplicationStatus">
//             <Form.Label>Application Status</Form.Label>
//             <Form.Control type="textarea" placeholder="Application Status" />
//         </Form.Group>
//         </Form>
//         <button>Save</button>
//       </Container>
// </div>
