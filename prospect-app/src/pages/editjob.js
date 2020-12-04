import React , { useEffect, useState } from 'react';
import '../css-files/app.css';
import axios from 'axios';

import Navbar from '../components/navbar-lp';
import Button from 'react-bootstrap/Button';
import Container from '@material-ui/core/Container';
import Form from 'react-bootstrap/Form';
import { useHistory } from 'react-router-dom'


export default function Testing() {
    // Loads page from the top
    const [jobTitle, setJobTitle] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [date, setDate] = useState('');
    const [recruiterFirstName, setRecruiterFirstName] = useState('');
    const [recruiterLastName, setRecruiterLastName] = useState('');
    const [recruiterEmail, setRecruiterEmail] = useState('');
    const [recruiterPhone, setRecruiterPhone] = useState('');
    const [status, setStatus] = useState('');
    const [disabledStatus, setDisabledStatus] = useState('');
    const history = useHistory();


    useEffect(() => {
        window.scrollTo(0, 0);
        setDisabledStatus(true); // keep this
        setJobTitle("Software Engineer");
        setDate("Idk");
        setStatus("Accepted");

        const datas =  { ApplicationId: 1 }

        const urlLink = 'http://127.0.0.1:5000/api/v1/search/applications?ApplicationId=1';

        const fetchApplication = async () => {
          const result = await axios.get(urlLink);
          setCompanyName(result.data.message[0].companyName);
          setJobTitle(result.data.message[0].positionTitle);
          setDate(result.data.message[0].appDate);
          setStatus(result.data.message[0].appStatus);
          console.log(result.data);
        }
        fetchApplication();

    }, [])


    const handleJobTitle = (e) => {
      setJobTitle(e.target.value);
    }

    const handleCompany = (e) => {
      setCompanyName(e.target.value);
    }

    const handleDate = (e) => {
      setDate(e.target.value);
    }

    const handleLocations = (e) => {
      //setFirstName(e.target.value);
    }

    const handleRecuiter = (e) => {
      //setFirstName(e.target.value);
    }

    const handleStatus = (e) => {
      setStatus(e.target.value);
    }

    const enableEdits = (e) => {
        console.log("Enable Edits");
        setDisabledStatus(false);
    }

    const deleteTheJob = (e) => {
        console.log("Delete Job");
        history.push('/home');

    }

    const updateDatabase = (e) => {
        console.log("Update Database");
        setDisabledStatus(true);
        const urlLink = "http://127.0.0.1:5000/api/v1/update/applications";
        const res = axios.post(urlLink,`ApplicationId=1&CompanyId=1&PositionTitle=${jobTitle}&AppicationLink=link2&ApplicationStatus=${status}&ApplicationDate=idk`);
    }

    return (
      <div>
          <Navbar />
          <div className="editPage">
            <Form className="editJobButtons">
              <Form.Group>
                <Button className="editJob" onClick={enableEdits}>Edit Job</Button>
              </Form.Group>
              <Form.Group>
                <Button className="deleteJob" onClick={deleteTheJob}>Delete Job</Button>
              </Form.Group>
              <Form.Group>
                <Button className="updateDatabase" onClick={updateDatabase}>Update</Button>
              </Form.Group>
            </Form>
            <Container className="editjob-bg">
            <Form>
            <Form.Group className="editRows">
                <Form.Label className="editText" >Job Title</Form.Label>
                <Form.Control disabled={disabledStatus} type="text" className="editValue" value={jobTitle} onChange={handleJobTitle}/>
            </Form.Group>
            <Form.Group className="editRows">
                <Form.Label className="editText">Company</Form.Label>
                <Form.Control disabled={disabledStatus} type="text" className="editValue" value={companyName} onChange={handleCompany}/>
            </Form.Group>
            <Form.Group className="editRows">
                <Form.Label className="editText">Date</Form.Label>
                <Form.Control disabled={disabledStatus} type="text" className="editValue" value={date} onChange={handleDate} />
            </Form.Group>
            <Form.Group className="editRows">
                <Form.Label className="editText">Status</Form.Label>
                <Form.Control disabled={disabledStatus} type="text" className="editValue" value={status} onChange={handleStatus}/>
            </Form.Group>
            </Form>
            </Container>
          </div>
      </div>
    )
}


//<Form.Group className="editRows" onChange={handleLocations}>
//    <Form.Label className="editText">Locations</Form.Label>
//    <Form.Control as="text" className="editValue">Nowhere</Form.Control>
//</Form.Group>
//<Form.Group className="editRows" onChange={handleRecuiter}>
//    <Form.Label className="editText">Recruiter</Form.Label>
//    <Form.Control as="text" className="editValue">No One</Form.Control>
//</Form.Group>
