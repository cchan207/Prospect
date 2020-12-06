import * as React from 'react';
import Link from '@material-ui/core/Link';
import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';
import axios from 'axios';

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
    fontSize: 14
  },
});

const localhost = 'http://127.0.0.1:5000';
const status_summary_url = '/api/v1/count/applications/status';

export default function Deposits() {
  const classes = useStyles();

  const [pending, setPending] = useState(-1);
  const [denied, setDenied] = useState(-1);
  const [accepted, setAccepted] = useState(-1);
  
  useEffect(() => {
    const fetchSummary = async () => {
      const res = await axios.get(localhost + status_summary_url + '?email=cohen50@purdue.edu')

      for (var i = 0; i < res.data.message.length; i++) {
        if (res.data.message[i].ApplicationStatus == "PENDING") {
          setPending(res.data.message[i].Total);
        } else if (res.data.message[i].ApplicationStatus == "ACCEPTED") {
          setAccepted(res.data.message[i].Total);
        } else {
          setDenied(res.data.message[i].Total);
        }
      }
      console.log(res);
    }
    fetchSummary();
    
    if (pending < 0) {
      setPending(0);
    } 
    if (denied < 0) {
      setDenied(0);
    }
    if (accepted < 0) {
      setAccepted(0);
    }
  }, [])

  return (
    <React.Fragment>
      <Title>Status Overview</Title>
      <Typography component="p" variant="h8">
        PENDING
      </Typography>
      {pending >= 0 &&
      <Typography color="textSecondary" className={classes.depositContext}>
        {pending} applications
      </Typography>}
      <Typography component="p" variant="h8">
        DENIED
      </Typography>
      {denied >= 0 &&
      <Typography color="textSecondary" className={classes.depositContext}>
        {denied} applications
      </Typography>}
      <Typography component="p" variant="h8">
        ACCEPTED
      </Typography>
      {accepted >= 0 &&
      <Typography color="textSecondary" className={classes.depositContext}>
        {accepted} applications
      </Typography>}
      {/* <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View more
        </Link>
      </div> */}
    </React.Fragment>
  );
}
