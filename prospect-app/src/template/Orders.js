import * as React from 'react';
import { useEffect, useState } from 'react';
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
  const email = !isLoading && user.email;
  if (email) {
    console.log(email);
  }

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

  const rows = [
  createData(
    0,
    'Software Engineer',
    'Salesforce',
    'Indianapolis, IN',
    '2020-12-3',
    'PENDING',
  ),
  ];

  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Job Applications</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Job Title</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.jobTitle}</TableCell>
              <TableCell>{row.company}</TableCell>
              <TableCell>{row.location}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell align="right">{`${row.status}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          See more applications
        </Link>
      </div>
    </React.Fragment>
  );
}

export default Orders;
