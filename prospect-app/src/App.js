import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import AppContext from './components/context';
import "bootstrap/dist/css/bootstrap.min.css";
import { Auth0Provider } from "@auth0/auth0-react";

import {
    HashRouter as Router,
    Switch,
    Route
  } from "react-router-dom";

  import Login from './pages/login';
  import Home from './pages/landingpage';
  import Job from './pages/job';

function App() {
    const [login, setLogin] = useState(false); // not logged in initially
    const toggleLogin = () => {
      setLogin(!login);
      login === false ? window.location.href = "#home" : window.location.href = "#";
    }

    const userSettings = {
      loginState: login,
      toggleLogin,
    };

    return (
        <AppContext.Provider value={userSettings}>
            <Switch>
                <Route exact path="/" component={Login} />
                <Route exact path="/home" component={Home} />
                <Route exact path="/job" component={Job} />
            </Switch>
        </AppContext.Provider>
    );
}

ReactDOM.render(
    <Router>
        <Auth0Provider
            domain="prospect-jobs.us.auth0.com"
            clientId="rFKAUuhFOosR4gMNkekfsActq1slvs0g"
            redirectUri={window.location.origin}
        >
        <App />
      </Auth0Provider>
    </Router>,
    document.getElementById("root")
  );

//export default App;
