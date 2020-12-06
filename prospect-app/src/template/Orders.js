import * as React from 'react';
import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import AddBoxIcon from '@material-ui/icons/AddBox';
import EditIcon from '@material-ui/icons/Edit';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';

const localhost = 'http://127.0.0.1:5000';
const get_applications_api = '/api/v1/search/applications/all';

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

const Orders = () => {
  const { user, isLoading } = useAuth0();

  const [appData, setApps] = useState({ message: [] });
  // const [isError, setIsError] = useState(false);

  useEffect( async () => {
      const fetchApplications = async () => {
        const result = await axios.get(localhost + get_applications_api + `?email=chan207@purdue.edu`, { crossorigin:true });
        console.log(result.data);
        setApps(result.data);
      }
      fetchApplications();
  },[]);


  // Generate Order Data
  function createData(id, jobTitle, company, location, date, status) {
    return { id, jobTitle, company, location, date, status };
  }

  console.log(appData.response);

  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Job Applications
      <Link href='/add-job/' >
        <AddBoxIcon className="add-app"/>
      </Link>
      </Title>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Job Title</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Link</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>

          {appData.response && appData.response.map((row) => (
          <TableRow key={row.ApplicationId}>
              <TableCell>{row.PositionTitle}</TableCell>
              <TableCell>{row.CompanyName}</TableCell>
              <TableCell><a href={row.ApplicationLink}>{row.ApplicationLink}</a></TableCell>
              <TableCell>{row.ApplicationDate}</TableCell>
              <TableCell>{`${row.ApplicationStatus}`}</TableCell>
              <TableCell align="right">
                <Link href={`/edit-job/${row.ApplicationId}`} >
                Details
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>

      </div>
    </React.Fragment>
  );
}

export default Orders;
