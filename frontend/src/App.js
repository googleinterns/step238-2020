 import React from 'react';
 import './App.css';
 import { Client, Status } from "@googlemaps/google-maps-services-js";
 import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
 import { Link } from 'react-router-dom';
 import { createBrowserHistory } from "history";
 import SECRET_KEY from './config';
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
