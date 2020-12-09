import React , { useEffect, useState } from 'react';
import '../css-files/app.css';
import axios from 'axios';

import Container from '@material-ui/core/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import LoginButton from '../components/loginButton';
import AppContext from '../components/context';
import Col from 'react-bootstrap/Col';
import { useHistory } from 'react-router-dom';


import Navbar from '../components/navbar-lp';


export default function LandingPage() {
    const [jobTitle, setJobTitle] = useState('');
    const [company, setCompany] = useState('');
    const [appLink, setAppLink] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('Alabama'); // used to be ''
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [appStatus, setAppStatus] = useState('PENDING'); //used to be ''

    const history = useHistory();

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const activateButton = async () => {
        console.log(jobTitle)
        console.log(company)
        console.log(appLink)
        console.log(city)
        console.log(state)
        console.log(firstName)
        console.log(lastName)
        console.log(email)
        console.log(phoneNumber)
        console.log(appStatus)

        const urlLink = "http://127.0.0.1:5000/api/v1/add/applications";
         const userEmail = localStorage.getItem('userEmail');
      //  const userEmail = 'charlorrnot@gmail.com'
        const res = await axios.post(
                      urlLink, `userEmail=${userEmail}&title=${jobTitle}&link=${appLink}&company=${company}&status=${appStatus}&city=${city}&state=${state}&recFirst=${firstName}&recLast=${lastName}&recEmail=${email}&recPhone=${phoneNumber}`);
        console.log(res);
        history.push('/home');
    }

    const handleCompany = (e) => {
      setCompany(e.target.value);
    }

    const handleJobTitle = (e) => {
      setJobTitle(e.target.value);
    }

    const handleAppLink = (e) => {
      setAppLink(e.target.value);
    }

    const handleCity = (e) => {
     setCity(e.target.value);
   }

    const handleState = (e) => {
     setState(e.target.value);
   }

   const handleFirstName = (e) => {
      setFirstName(e.target.value);
    }

    const handleLastName = (e) => {
      setLastName(e.target.value);
    }

    const handleEmail = (e) => {
      setEmail(e.target.value);
      console.log(typeof email)
    }

    const handlePhoneNumber = (e) => {
      setPhoneNumber(e.target.value)
    }

    const handleAppStatus = (e) => {
      setAppStatus(e.target.value)
    }

    return (
      <div>
      <Navbar />
      <div className="addUser-parent">
      <Container className="addUser-bg">
        <Form>
        <Form.Group>
        <h4>JOB INFORMATION</h4>
        <Form.Label>Job Title</Form.Label>
        <Form.Control type="text" placeholder="Job Title" onChange={handleJobTitle} value={jobTitle}/>
        <Form.Label>Application URL</Form.Label>
        <Form.Control type="text" placeholder="Application URL" onChange={handleAppLink} value={appLink}/>
        <Form.Label>Application Status:</Form.Label>
        <Form.Control as="select" onChange={handleAppStatus} value={appStatus}>
            <option value="Select status" disabled>Select status</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="DENIED">Denied</option>
        </Form.Control>
        </Form.Group>

        <Form.Group>
        <h4>COMPANY INFORMATION</h4>
        <Form.Label>Company Name</Form.Label>
        <Form.Control type="textarea" placeholder="Company Name" onChange={handleCompany} value={company} />
        <Form.Row>
          <Col>
          <Form.Label>City</Form.Label>
          <Form.Control type="textarea" placeholder="City" onChange={handleCity} value={city}/>
          </Col>
          <Col>
          <Form.Label>State</Form.Label>
          <Form.Control as="select" onChange={handleState} value={state}>
              <option value="Select state" disabled>Select state</option>
              <option value="Alabama">Alabama</option>
              <option value="Alaska">Alaska</option>
              <option value="Arizona">Arizona</option>
              <option value="Arkansas">Arkansas</option>
              <option value="California">California</option>
              <option value="Colorado">Colorado</option>
              <option value="Connecticut">Connecticut</option>
              <option value="Delaware">Delaware</option>
              <option value="Florida">Florida</option>
              <option value="Georgia">Georgia</option>
              <option value="Hawaii">Hawaii</option>
              <option value="Idaho">Idaho</option>
              <option value="Illinois">Illinois</option>
              <option value="Indiana">Indiana</option>
              <option value="Iowa">Iowa</option>
              <option value="Kansas">Kansas</option>
              <option value="Kentucky">Kentucky</option>
              <option value="Louisiana">Louisiana</option>
              <option value="Maine">Maine</option>
              <option value="Maryland">Maryland</option>
              <option value="Massachusetts">Massachusetts</option>
              <option value="Michigan">Michigan</option>
              <option value="Minnesota">Minnesota</option>
              <option value="Mississippi">Mississippi</option>
              <option value="Missouri">Missouri</option>
              <option value="Montana">Montana</option>
              <option value="Nebraska">Nebraska</option>
              <option value="Nevada">Nevada</option>
              <option value="New Hampshire">New Hampshire</option>
              <option value="New Jersey">New Jersey</option>
              <option value="New Mexico">New Mexico</option>
              <option value="New York">New York</option>
              <option value="North Carolina">North Carolina</option>
              <option value="North Dakota">North Dakota</option>
              <option value="Ohio">Ohio</option>
              <option value="Oklahoma">Oklahoma</option>
              <option value="Pennsylvania">Pannsylvania</option>
              <option value="Rhode Island">Rhode Island</option>
              <option value="South Carolina">South Carolina</option>
              <option value="South Dakota">South Dakota</option>
              <option value="Tennessee">Tennessee</option>
              <option value="Texas">Texas</option>
              <option value="Utah">Utah</option>
              <option value="Vermont">Vermont</option>
              <option value="Virginia">Virginia</option>
              <option value="Washington">Washington</option>
              <option value="West Virginia">West Virginia</option>
              <option value="Wisconsin">Wisconsin</option>
              <option value="Wyoming">Wyoming</option>
          </Form.Control>
          </Col>
        </Form.Row>
        </Form.Group>

        <Form.Group>
        <h4>RECRUITER INFORMATION</h4>
        <Form.Row>
          <Col>
          <Form.Label>First Name</Form.Label>
          <Form.Control type="text" placeholder="First Name" onChange={handleFirstName} value={firstName}/>
          </Col>
          <Col>
          <Form.Label>Last Name</Form.Label>
          <Form.Control type="text" placeholder="Last Name" onChange={handleLastName} value={lastName}/>
          </Col>
        </Form.Row>
        <Form.Label>Email</Form.Label>
        <Form.Control type="text" placeholder="Email" onChange={handleEmail} value={email}/>
        <Form.Label>Phone Number</Form.Label>
        <Form.Control type="text" placeholder="xxx-xxx-xxxx" onChange={handlePhoneNumber} value={phoneNumber}/>
        </Form.Group>

        </Form>
        <Button variant="dark" type="submit" onClick={activateButton}>SUBMIT</Button>
    </Container>
    </div>
    </div>
    )
}
