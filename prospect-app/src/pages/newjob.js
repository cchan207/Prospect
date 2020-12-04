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
      // Job Information
    const [jobTitle, setJobTitle] = useState('');
    const [company, setCompany] = useState('');
    const [appLink, setAppLink] = useState('');
      // Location Information
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
      // Recruiter Information
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
      
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const activateButton = () => {
          // Job info
        console.log(jobTitle)
        console.log(company)
        console.log(appLink)
          // Location info
        console.log(city)
        console.log(state)
          // Recruiter info
        console.log(firstName)
        console.log(lastName)
        console.log(email)
        console.log(phoneNumber)

        const urlLink = "http://127.0.0.1:5000/api/v1/add/user";

        const res = axios.post(urlLink, `JobTitle=${jobTitle}&Company=${company}&AppLink=${appLink}
        &City=${city}&State=${state}
        &FirstName=${firstName}&LastName=${lastName}&Email=${email}&PhoneNumber=${phoneNumber}`);
        return res.form;

    }

      // States Dropdown


      // Job Information
    const handleCompany = (e) => {
      setCompany(e.target.value);
    }

    const handleJobTitle = (e) => {
      setJobTitle(e.target.value);
    }

    const handleAppLink = (e) => {
      setAppLink(e.target.value);
    }

      // Location Information
    const handleCity = (e) => {
      setCity(e.target.value);
    }

    const handleState = (e) => {
      setState(e.target.value);
    }

      // Recruiter Information
    const handleFirstName = (e) => {
      setFirstName(e.target.value);
    }

    const handleLastName = (e) => {
      setLastName(e.target.value);
    }

    const handleEmail = (e) => {
      setEmail(e.target.value);
    }
      
    const handlePhoneNumber = (e) => {
      setPhoneNumber(e.target.value)
    }
      

    return (
      <div>
          <Navbar />
            <Container className="addUser-bg">
              <Form>
              <h4>Job Information</h4>
              <Form.Group onChange={handleCompany} value={company}>
                  <Form.Label>Company</Form.Label>
                  <Form.Control type="textarea" placeholder="Company Name" />
              </Form.Group>
              <Form.Group onChange={handleJobTitle} value={jobTitle}>
                  <Form.Label>Job Title</Form.Label>
                  <Form.Control type="textarea" placeholder="Job Title" />
              </Form.Group>
              <Form.Group onChange={handleAppLink} value={appLink}>
                  <Form.Label>Application Link</Form.Label>
                  <Form.Control type="textarea" placeholder="url" />
              </Form.Group>
              <h4>Location</h4>
              <Form.Group onChange={handleCity} value={city}>
                  <Form.Label>City</Form.Label>
                  <Form.Control type="textarea" placeholder="City Name" />
              </Form.Group>
              <Form.Group onChange={handleState} value={state}>
                <label for="States">State:</label>
                <select id="state" name="state">
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
                </select>
              </Form.Group>
              <h4>Recruiter Information</h4>
              <Form.Group onChange={handleFirstName} value={firstName}>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="textarea" placeholder="Jane" />
              </Form.Group>
              <Form.Group onChange={handleLastName} value={lastName}>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="textarea" placeholder="Doe" />
              </Form.Group>
              <Form.Group onChange={handleEmail} value={email}>
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="textarea" placeholder="Email@domain" />
              </Form.Group>
              <Form.Group onChange={handlePhoneNumber} value={phoneNumber}>
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control type="textarea" placeholder="XXX-XXX-XXXX" />
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
