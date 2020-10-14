import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import AppContext from './components/context';
import "bootstrap/dist/css/bootstrap.min.css";

import {
    HashRouter as Router,
    Switch,
    Route
  } from "react-router-dom";

  import Home from './pages/landingpage';
  import Login from './pages/login';
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
      <App />
    </Router>,
    document.getElementById("root")
  );

//export default App;
