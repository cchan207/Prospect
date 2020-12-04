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
      // Application Information
    const [appStatus, setAppStatus] = useState('');
    const [appYear, setAppYear] = useState('');
    const [appMonth, setAppMonth] = useState('');
    const [appDay, setAppDay] = useState('');
      
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
          // Application Status
        console.log(appStatus)
        console.log(appYear)
        console.log(appMonth)
        console.log(appDay)

        const urlLink = "http://127.0.0.1:5000/api/v1/add/user";

        const res = axios.post(urlLink, `JobTitle=${jobTitle}&Company=${company}&AppLink=${appLink}
        &City=${city}&State=${state}
        &FirstName=${firstName}&LastName=${lastName}&Email=${email}&PhoneNumber=${phoneNumber}
        &AppStatus=${appStatus}&AppYear=${appYear}&AppMonth=${appMonth}&AppDay=${appDay}`);
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
      // App Information
    const handleAppStatus = (e) => {
      setAppStatus(e.target.value)
    }

    const handleAppYear = (e) => {
      setAppYear(e.target.value)
    }

    const handleAppMonth = (e) => {
      setAppMonth(e.target.value)
    }

    const handleAppDay = (e) => {
      setAppDay(e.target.value)
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
              <h4>Application Information</h4>
              <Form.Group onChange={handleAppStatus} value={appStatus}>
                  <Form.Label>Application Status:</Form.Label>
                  <select id="state" name="state">
                    <option value="PENDING">PENDING</option>
                    <option value="ACCEPTED">ACCEPTED</option>
                    <option value="DENIED">DENIED</option>
                  </select>
              </Form.Group> 
              <h6>Enter Date:</h6>
              <Form.Group onChange={handleAppYear} value={appYear}>
                  <Form.Label>Year:</Form.Label>
                  <select id="appYear" name="appYear">
                    <option value="2010">2010</option>
                    <option value="2011">2011</option>
                    <option value="2012">2012</option>
                    <option value="2013">2013</option>
                    <option value="2014">2014</option>
                    <option value="2015">2015</option>
                    <option value="2016">2016</option>
                    <option value="2017">2017</option>
                    <option value="2018">2018</option>
                    <option value="2019">2019</option>
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                    <option value="2029">2029</option>
                    <option value="2030">2030</option>
                  </select>
              </Form.Group> 
              <Form.Group onChange={handleAppMonth} value={appMonth}>
                  <Form.Label>Month:</Form.Label>
                  <select id="appMonth" name="appMonth">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    
                  </select>
              </Form.Group>    
              <Form.Group onChange={handleAppDay} value={appDay}>
                  <Form.Label>Day:</Form.Label>
                  <select id="appDay" name="appDay">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                    <option value="24">24</option>
                    <option value="25">25</option>
                    <option value="26">26</option>
                    <option value="27">27</option>
                    <option value="28">28</option>
                    <option value="29">29</option>
                    <option value="30">30</option>
                    <option value="31">31</option>
                    <option value="32">32</option>
                  </select>
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
