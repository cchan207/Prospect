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
    //const [locationList, setLocationList] = useState([city, state])
    const [locationList, setLocationList] = useState([{ City: "", State: "" }]);

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
        //console.log(city)
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
    //const handleCity = (e) => {
    //  setCity(e.target.value);
   // }

    //const handleState = (e) => {
    //  setState(e.target.value);
   // }

    //const handleLocationChange = (e, index) => {
    //  const { name, value } = e.target;
    //  const list = [...locationList];
    //  list[index][name] = value;
    //  setLocationList(list);
    //}

    // handle input change
    const handleLocationChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...locationList];
    list[index][name] = value;
    setLocationList(list);
};
 
// handle click event of the Remove button
const handleRemoveClick = index => {
  const list = [...locationList];
  list.splice(index, 1);
  setLocationList(list);
};
 
// handle click event of the Add button
const handleAddClick = () => {
  setLocationList([...locationList, { City: "", State: "" }]);
};

    //const handleAddLocation = () => {
    //  setLocationList([...locationList, { city, state}]);
    //}

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
        <Form.Group>

        <h4>JOB INFORMATION</h4>
        <Form.Label onChange={handleJobTitle}>Job Title</Form.Label>
        <Form.Control type="textarea" placeholder="Job Title" />
        <Form.Label onChange={handleAppLink}>Application URL</Form.Label>
        <Form.Control type="textarea" placeholder="Application URL" />
        <Form.Label>Application Status:</Form.Label>
        <Form.Control as="select">
            <option value="PENDING">PENDING</option>
            <option value="ACCEPTED">ACCEPTED</option>
            <option value="DENIED">DENIED</option>
        </Form.Control>

        <h4>COMPANY INFORMATION</h4>
        <Form.Label onChange={handleCompany}>Company Name</Form.Label>
        <Form.Control type="textarea" placeholder="Company Name" />
        <Form.Label>City</Form.Label>
        <Form.Control type="textarea" placeholder="City" />
      
        <Form.Label>State</Form.Label>
        <Form.Control as="select">
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

        <h4>RECRUITER INFORMATION</h4>
        <Form.Label onChange={handleFirstName} value={firstName}>First Name</Form.Label>
        <Form.Control type="textarea" placeholder="First Name" />
        <Form.Label onChange={handleLastName} value={lastName}>Last Name</Form.Label>
        <Form.Control type="textarea" placeholder="Last Name" />
        <Form.Label onChange={handleEmail} value={email}>Email</Form.Label>
        <Form.Control type="textarea" placeholder="Email" />
        <Form.Label onChange={handlePhoneNumber} value={phoneNumber}>Phone Number</Form.Label>
        <Form.Control type="textarea" placeholder="xxx-xxx-xxxx" />

        </Form.Group>
        </Form>
        <Button variant="dark" type="submit" onClick={activateButton}>SUBMIT</Button>
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
