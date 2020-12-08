import React , { useEffect } from 'react';
import Navbar from '../components/navbar-lp';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";

export default function LandingPage() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

      const { user, isAuthenticated } = useAuth0();

      if (isAuthenticated) {
        console.log('it is ' + user.email);
        localStorage.setItem('userEmail', user.email);
        console.log('User info saved to local storage!')
        console.log(user);
        const email = user.email;
        const localhost = 'http://127.0.0.1:5000/';
        const api = `api/v1/search/users/`;
        console.log(localhost + api + `?email=${email}`)
        // Add user to database here
        axios.get(localhost + api + `?email=${email}`, { crossorigin:true });
      }

    return (
        <div>
            <Navbar />
            WELCOME
        </div>
    )
}
