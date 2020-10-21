import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import AppContext from './components/context';
import "bootstrap/dist/css/bootstrap.min.css";

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
                <Route exact path="/add-job" component={Job} />
              </div>
            </BrowserRouter>
            </Switch>
        </AppContext.Provider>
    );
}

ReactDOM.render(
    <Router>
      <App />
    </Router>,
    document.getElementById("root")
  );

//export default App;
