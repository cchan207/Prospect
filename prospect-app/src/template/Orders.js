import * as React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';

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

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function Orders() {
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
