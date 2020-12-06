import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import AppContext from './components/context';
import "bootstrap/dist/css/bootstrap.min.css";
import { Auth0Provider } from "@auth0/auth0-react";

import {
    BrowserRouter as Router,
    Switch,
    Route, BrowserRouter
  } from "react-router-dom";

  import Login from './pages/login';
  import SignUp from './pages/signup';
  import LandingPage from './pages/landingpage';
  import Home from './pages/job';
  import About from './pages/about';
  import Job from './pages/newjob';
  import Edit from './pages/editjob';

function App() {
    const [login, setLogin] = useState(false); // not logged in initially
    const toggleLogin = () => {
      setLogin(!login);
      login === false ? window.location.href = "/home" : window.location.href = "/";
    }

    const userSettings = {
      loginState: login,
      toggleLogin,
    };

    return (
        <AppContext.Provider value={userSettings}>
            <Switch>
            <BrowserRouter basename="/">
              <div>
                <Route exact path="/" component={LandingPage} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/signup" component={SignUp} />
                <Route exact path="/home" component={Home} />
                <Route exact path="/about" component={About} />
                <Route exact path="/add-job/" component={Job} />
                <Route exact path="/edit-job/:appId" component={Edit} />
              </div>
            </BrowserRouter>
            </Switch>
        </AppContext.Provider>
    );
}

ReactDOM.render(
    <Router>
        <Auth0Provider
            domain="prospect-jobs.us.auth0.com"
            clientId="rFKAUuhFOosR4gMNkekfsActq1slvs0g"
            redirectUri={'http://localhost:3000/home'}
        >
        <App />
      </Auth0Provider>
    </Router>,
    document.getElementById("root")
  );

//export default App;
