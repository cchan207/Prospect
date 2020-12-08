import React , { useEffect, useState } from 'react';
import '../css-files/app.css';
import axios from 'axios';


import Navbar from '../components/navbar-lp';
import Button from 'react-bootstrap/Button';
import Container from '@material-ui/core/Container';
import Form from 'react-bootstrap/Form';
import { useHistory, useParams } from 'react-router-dom';

export default function Testing() {
  let { appId } = useParams();
  //console.log(appId);
  // Loads page from the top
    const [jobTitle, setJobTitle] = useState('');
    const [companyName, setCompanyName] = useState('');

    const [recruiterFirstName, setRecruiterFirstName] = useState('');
    const [recruiterLastName, setRecruiterLastName] = useState('');
    const [recruiterEmail, setRecruiterEmail] = useState('');
    const [recruiterPhone, setRecruiterPhone] = useState('');
    const [status, setStatus] = useState('');
    const [disabledStatus, setDisabledStatus] = useState('');
    const [locationDisabled, setLocationDisabled] = useState('');
    const [editDisabled, setEditDisabled] = useState('');
    const [link, setLink] = useState('');
    const [hiddenStatus, setHiddenStatus] = useState('');
    const [locations, setLocations] = useState([{ CityName: "", StateAbbr: "", StateName: "" }]);
    const [oldLocations, setOldLocations] = useState([{ CityName: "", StateAbbr: "", StateName: "" }]);
    //const [newLocations, setNewLocations] = useState([{ CityName: "", StateName: "" }]);
    const history = useHistory();

    // this function is from https://medium.com/javascript-in-plain-english/how-to-deep-copy-objects-and-arrays-in-javascript-7c911359b089
    const deepCopyFunction = (inObject) => {
      let outObject, value, key

      if (typeof inObject !== "object" || inObject === null) {
        return inObject // Return the value if inObject is not an object
      }

      // Create an array or object to hold the values
      outObject = Array.isArray(inObject) ? [] : {}

      for (key in inObject) {
        value = inObject[key]

        // Recursively (deep) copy for nested objects, including arrays
        outObject[key] = deepCopyFunction(value)
      }

      return outObject
    }


    useEffect(() => {
        window.scrollTo(0, 0);
        setDisabledStatus(true);
        setHiddenStatus(true);
        setLocationDisabled(true);
        setEditDisabled(false);


        const urlLink = `http://127.0.0.1:5000/api/v1/search/applications?id=${appId}`; //CHANGE THIS EVENTUALLY

        const fetchApplication = async () => {

          const result = await axios.get(urlLink);
          const item = result.data.Locations;
          let deepCopiedArray = deepCopyFunction(item);
          let deepCopiedArray2 = deepCopyFunction(item);

          setLocations(deepCopiedArray);
          setOldLocations(deepCopiedArray2);

          setCompanyName(result.data.CompanyName);
          setJobTitle(result.data.PositionTitle);
          setLink(result.data.ApplicationLink);

          setRecruiterFirstName(result.data.Recruiter[0].RecFirstName);
          setRecruiterLastName(result.data.Recruiter[0].RecLastName);
          setRecruiterPhone(result.data.Recruiter[0].RecPhone);
          setRecruiterEmail(result.data.Recruiter[0].RecEmail);
          setStatus(result.data.ApplicationStatus);

          console.log(result)
        }
        fetchApplication();

    }, [])

    const handleStateAbbr = (e, index) => {
      // check if the add locaitons this is disabled
      if (hiddenStatus == false){
        const { name, value } = e.target;
        const list = [...oldLocations];
        const list2 = [...locations];
        list[index][name] = value;
        let value2 = deepCopyFunction(value);
        list2[index][name] = value2;
        setOldLocations(list);
        setLocations(list2);

      }
      else{
        const { name, value } = e.target;
        const list = [...locations];
        list[index][name] = value;
        setLocations(list);
      }
    }

    const handleCityName = (e, index) => {
      if (hiddenStatus == false){
        const { name, value } = e.target;
        const list = [...oldLocations];
        const list2 = [...locations];
        list[index][name] = value;
        let value2 = deepCopyFunction(value);
        list2[index][name] = value2;
        setOldLocations(list);
        setLocations(list2);
      }
      else{
        const { name, value } = e.target;
        const list = [...locations];
        list[index][name] = value;
        setLocations(list);
      }

    }

    const handleJobTitle = (e) => {
      setJobTitle(e.target.value);
    }

    const handleLink = (e) => {
      setLink(e.target.value);
    }

    const handleCompany = (e) => {
      setCompanyName(e.target.value);
    }

    const handleStatus = (e) => {
      setStatus(e.target.value);
    }

    const handleRecFirstName = (e) => {
      setRecruiterFirstName(e.target.value);
    }

    const handleRecLastName = (e) => {
      setRecruiterLastName(e.target.value);
    }

    const handleRecEmail = (e) => {
      setRecruiterEmail(e.target.value);
    }

    const handleRecPhone = (e) => {
      setRecruiterPhone(e.target.value);
    }

    const enableEdits = (e) => {
        console.log("Enable Edits");
        setDisabledStatus(false);
        setEditDisabled(true);
        setLocationDisabled(false);
    }

    const deleteTheJob = (e) => {
        console.log("Delete Job");
      //  const id = 5; //TEMPPPPPPPPPPP
        const urlLink = "http://127.0.0.1:5000/api/v1/delete/applications"; //ADD PARAMETERS: applicaiton id
        const res = axios.post(urlLink,`id=${appId}`);
        history.push('/home');
    }

    const saveNewLocation = (e) => {
        console.log("Save New Location");

        const urlLink = "http://127.0.0.1:5000/api/v1/add/locations"; //ADD PARAMETERS: application id, city name, city state
        //const id = 10; //TEMPPPPPPPPPPP
        const entry = locations.slice(-1)[0];
        const res = axios.post(urlLink,`id=${appId}&city=${entry.CityName}&state=${entry.StateName}`);

        setEditDisabled(true);
        setHiddenStatus(true);
        setLocationDisabled(false);
        setDisabledStatus(false);
    }

    const addLocationSpace = (e) => {
        console.log("Add Location Space");
        setHiddenStatus(false);
        setEditDisabled(true);
        setDisabledStatus(true);
        setLocations([...locations, { CityName: "", StateAbbr: "", StateName: "" }]);
        setOldLocations([...oldLocations, { CityName: "", StateAbbr: "", StateName: "" }]);
    }

    const updateDatabase = (e) => {
        console.log("Update Database");
        setDisabledStatus(true);
        setLocationDisabled(true);
        setEditDisabled(false);
        const urlLink = 'http://127.0.0.1:5000/api/v1/update/applications';
        for (var i = 0; i < locations.length; i++){
          const oldCity = oldLocations[i].CityName;
          const newCity = locations[i].CityName;
          const newState = locations[i].StateName;
        //  const id = 10;
          const res = axios.post(urlLink, `id=${appId}&title=${jobTitle}&link=${link}&company=${companyName}&status=${status}&oldCity=${oldCity}&newCity=${newCity}&newState=${newState}&recFirst=${recruiterFirstName}&recLast=${recruiterLastName}&recEmail=${recruiterEmail}&recPhone=${recruiterPhone}`);

        let deepCopiedArray2 = deepCopyFunction(locations);
        setOldLocations(deepCopiedArray2);

        }
    }

  return (
      <div>
          <Navbar />
          <div className="editPage">
            <Form className="editJobButtons">
              <Form.Group>
                <Button disabled={editDisabled} className="editJob" onClick={enableEdits}>Edit Job</Button>
              </Form.Group>
              <Form.Group>
                <Button className="deleteJob" onClick={deleteTheJob}>Delete Job</Button>
              </Form.Group>
              <Form.Group>
                <Button disabled={disabledStatus} className="updateDatabase" onClick={updateDatabase}>Update</Button>
              </Form.Group>
              <Form.Group>
                <Button disabled={disabledStatus} className="addLocation" onClick={addLocationSpace}>Add Location</Button>
              </Form.Group>
              <Form.Group>
                <Button hidden={hiddenStatus} className="saveNewLocation" onClick={saveNewLocation}>Save New Location</Button>
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
                <Form.Label className="editText">Current Status</Form.Label>
                <Form.Control disabled={disabledStatus} type="text" className="editValue" value={status} onChange={handleStatus}/>
            </Form.Group>
            <Form.Group className="editRows">
                <Form.Label className="editText">Application Link</Form.Label>
                <Form.Control disabled={disabledStatus} type="text" className="editValue" value={link} onChange={handleLink}/>
            </Form.Group>


            <Form.Group className="editRows">
                <Form.Label className="editText">Locations</Form.Label>

                {locations.map((x, i) => {
                  return (
                    <div className="box">

                    <Form.Group>
                      <Form.Label>City {i}</Form.Label>
                      <Form.Control onChange={e => handleCityName(e, i)} disabled={locationDisabled} name="CityName" className="editValue" type="text" value={x.CityName}/>
                    </Form.Group>

                    <Form.Group>
                      <select onChange={e => handleStateAbbr(e, i)} disabled={locationDisabled} id="StateName" name="StateName" value={x.StateName}>
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
                  </div>
                  );
                })}
            </Form.Group>



            <Form.Group className="editRows">
                <Form.Label className="editText">Recruiter</Form.Label>
                <Form>
                <Form.Label className="editText">First Name</Form.Label>
                <Form.Control disabled={disabledStatus} type="text" value={recruiterFirstName} onChange={handleRecFirstName} className="editValue"/>
                </Form>
                <Form>
                <Form.Label className="editText">Last Name</Form.Label>
                <Form.Control disabled={disabledStatus} type="text" value={recruiterLastName} onChange={handleRecLastName} className="editValue"/>
                </Form>
                <Form>
                <Form.Label className="editText">Email</Form.Label>
                <Form.Control disabled={disabledStatus} type="text" value={recruiterEmail} onChange={handleRecEmail} className="editValue"/>
                </Form>
                <Form>
                <Form.Label className="editText">Phone Number</Form.Label>
                <Form.Control disabled={disabledStatus} type="text" value={recruiterPhone} onChange={handleRecPhone} className="editValue"/>
                </Form>
            </Form.Group>
            </Form>
            </Container>
          </div>
      </div>
    )
}
