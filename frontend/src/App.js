import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Itinerary from './Itinerary';
import LandingPage from './LandingPage';

function App() {
    return (
        <div className="App">
            <Router>
                <div>
                    <Switch>
                        <Route exact path="/" component={LandingPage} />
                        <Route path="/map" component={Itinerary} />
                    </Switch>
                </div>
            </Router>
        </div>
    );
}

export default App;
