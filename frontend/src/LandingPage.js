import React, { useState, useEffect, useRef } from "react";
import './App.css';
import { Client, Status } from "@googlemaps/google-maps-services-js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Link } from 'react-router-dom';
import { createBrowserHistory } from "history";
import SECRET_KEY from './config';
import ITINERARY_KEY from './configMap';
import Map from './Itinerary';
import Button from "react-bootstrap/Button";
import ReactDOM from 'react-dom';
import ImgKey from './configImg';
// import DayPickerInput from 'react-day-picker/DayPickerInput';
// import 'react-day-picker/lib/style.css';

let autoComplete1, autoComplete2, currentUserId;

function LandingPage() {
    let google, map, markers = [];
    function initMap() {
        google = window.google;

        const cityLocation = {
          lat: 48.1351,
          lng: 11.5820
        };
        map = new google.maps.Map(document.getElementById("map"), {
          zoom: 11,
          center: cityLocation
        });
    }
    useEffect(() => {
        loadScript(
            'https://maps.googleapis.com/maps/api/js?key=' + Object.values(ITINERARY_KEY)[0] + '&libraries=places'
        );
        authentication();
        if (!window.google) {
            const key = Object.values(ITINERARY_KEY)[0];
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = 'https://maps.googleapis.com/maps/api/js?key='+key;
            s.src += '&libraries=&v=weekly';
            document.head.appendChild(s);
            s.addEventListener('load', e => {
                initMap();
            })
        } else {
            initMap();
        }
    });
    function removeMarker(location) {
        // Convert string location to JSON object.
        const position = {
            lat: parseFloat(location.split(',')[0]),
            lng: parseFloat(location.split(',')[1]),
        };

        // Before updating markers clear all markers.
        for (let i = 0; i < markers.length; i++) {
          markers[i].markerObject.setMap(null);
        }

        // Find the specific marker and remove from the array.
        for (let i = 0; i < markers.length; i++) {
          if (markers[i].position.lat == position.lat &&
              markers[i].position.lng == position.lng) {
            markers.splice(i,1);
            break;
          }
        }

        // Update the markers on map page.
        for (let i = 0; i < markers.length; i++) {
          markers[i].markerObject.setMap(map);
        }
    }
    function addMarker(location) {
        // Convert string location to JSON object.   
        const position = {
            lat: parseFloat(location.split(',')[0]),
            lng: parseFloat(location.split(',')[1]),
        };
        map.setCenter(position);

        const markerObject = new google.maps.Marker({
          position: position,
        });

        const marker = {
          position: position,
          markerObject: markerObject,
        }

        // Add new marker to the array.
        markers.push(marker);

        // Update markers on map page.
        for (let i = 0; i < markers.length; i++) {
          markers[i].markerObject.setMap(map);
        }
    }
    let lat1, lat2, long1, long2;
    const [hiddenIn, setHiddenIn] = useState(false);
    const [hiddenOut, setHiddenOut] = useState(true);
    function authentication() {
        
        fetch('/api/login')
            .then((response) => response.json())
            .then((user) => {
                const loginSection = document.getElementById('loginsection');
                const loginMessage = document.getElementById('login');
                const logoutSection = document.getElementById('logoutsection');
                const logoutMessage = document.getElementById('logout');
                
                if (user.loggedIn) {
                    loginSection.style.display = 'none';
                    logoutMessage.href = user.url;
                    logoutSection.style.display = 'block';
                    
                } else {
                    logoutSection.style.display = 'none';
                    loginMessage.href = user.url;
                    loginSection.style.display = 'block';
                    
                }
                currentUserId = user.id;
                localStorage.setItem("id", currentUserId);
            });
    }

    function calls() {
        handleScriptLoad1(setQuery1);
        handleScriptLoad2(setQuery2);
    }

    const loadScript = (url) => {
        let script = document.createElement("script");
        script.type = "text/javascript";

        if (script.readyState) {
            script.onreadystatechange = function() {
                if (script.readyState === "loaded" || script.readyState === "complete") {
                    script.onreadystatechange = null;
                    calls();
                }
            };
        } else {
            script.onload = () => calls();
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    };
    function handleScriptLoad1(updateQuery) {
        autoComplete1 = new window.google.maps.places.Autocomplete(
            document.getElementById("startplace"), { "types": ["geocode"] }
        );
        autoComplete1.setFields(["address_components", "formatted_address"]);
        autoComplete1.addListener("place_changed", () =>
            handlePlaceSelect1(updateQuery)
        );
    }
    function handleScriptLoad2(updateQuery) {
        autoComplete2 = new window.google.maps.places.Autocomplete(
            document.getElementById("endplace"), { "types": ["geocode"] }
        );
        autoComplete2.setFields(["address_components", "formatted_address"]);
        autoComplete2.addListener("place_changed", () =>
            handlePlaceSelect2(updateQuery)
        );
    }

    async function handlePlaceSelect1(updateQuery) {
        let addressObject1 = autoComplete1.getPlace();
        console.log(addressObject1);
        //lat1 = addressObject1.geometry.location.lat();
        //long1 = addressObject1.geometry.location.lng();
        let query1 = addressObject1.formatted_address;
        updateQuery(query1);
        

    }

    async function handlePlaceSelect2(updateQuery) {
        const addressObject2 = autoComplete2.getPlace();
        console.log(addressObject2);
        //lat2 = addressObject2.geometry.location.lat();
        //long2 = addressObject2.geometry.location.lng();
        const query2 = addressObject2.formatted_address;
        updateQuery(query2);
    }

    const [query1, setQuery1] = useState("");
    const [query2, setQuery2] = useState("");

    // useEffect(() => {
    //     loadScript(
    //         `https://maps.googleapis.com/maps/api/js?key=` + Object.values(ITINERARY_KEY)[0] + `&libraries=places`
    //     );
    //     authentication();
    // }, []);

    function createListElem(attraction) {
        const liElement = document.createElement("li");
        let touristsview = '';
        let open;
        const keyImg = Object.values(ImgKey)[0];
        if (attraction.opening_hours === undefined) { open = "info not available"; }
        else { open = attraction.opening_hours.open_now; }
        touristsview += '<img width="300" height="200" src=' + 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + attraction.photos[0].photo_reference + '&key=' + keyImg + '>' +
            '<br>' +
            '<strong id="rating">' + attraction.rating + '</strong>' +
            '<span id="total_rating">' + '(' + attraction.user_ratings_total + ')' + '</span>' +
            '<br>' +
            '<span id="name">' + attraction.name + '</span>' +
            '<br>'+
            '<span id="timetable">' + 'Opened: ' + open + '</span>';
        
        liElement.innerHTML = touristsview;
        const buttonAdd = document.createElement('button');
        buttonAdd.id = 'add-to-list';
        buttonAdd.innerText = 'ADD';
        buttonAdd.addEventListener('click', () => {
            if (buttonAdd.innerText == "ADD") {
                let url = localStorage["url"];
                //it should be something like locations=
                if (url === undefined) {
                    url = 'locations=';
                    
                }
                else
                    url += "*";
                const location = attraction.geometry.location.lat + "," + attraction.geometry.location.lng;
                url += location;
                addMarker(location);

                localStorage.setItem("url", url);
                buttonAdd.innerText = "REMOVE";
            }
            else {
                const location = attraction.geometry.location.lat + "," + attraction.geometry.location.lng;
                removeMarker(location);

                let url = localStorage["url"];
                let toDelete = '*' + location;

                url.replace(toDelete, "");//to delete the location if it's like *location;
                toDelete = toString(attraction.geometry.lng + "," + attraction.geometry.lat);
                url.replace(toDelete, ""); //to delete the location if it's the single location, or if it's the first one

                localStorage.setItem("url", url);

                buttonAdd.innerText = "ADD";
            }
        });
        liElement.appendChild(buttonAdd);
        return liElement;
    }
    let searchValue;
    function submitcity() {
        searchValue = document.getElementById('searchbox').value;
    
        searchValue.replace(/\s/g, '+');
        const key = Object.values(SECRET_KEY)[0];
        const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + searchValue +
            '&key=' + key;
        fetch(url)
            .then(response => response.json())
            .then(function(data) {
                const lat = data.results[0].geometry.location.lat;
                const lng = data.results[0].geometry.location.lng;
                const adress = '/api/attractions?lat=' + lat + '&long=' + lng;
                fetch(adress)
                    .then(response => response.json())
                    .then(function(attractions) {
                        setTimeout(function() {
                            const listatt = document.getElementById('attraction');
                            const listDiv = document.createElement('div');
                            listDiv.className = 'row';
                            listDiv.innerHTML = '';
                            attractions.results.sort((a, b) => {
                                return b.user_ratings_total - a.user_ratings_total;
                            });
                            for (let i = 0; i < attractions.results.length; i++) {
                                listDiv.appendChild(createListElem(attractions.results[i]));
                            }
                            localStorage.removeItem("url");
                            listatt.innerHTML = '';
                            listatt.appendChild(listDiv);
                        }
                            , 200);
                    }
                    );
            })
        setTimeout(function() { 
            document.getElementById('namethetrip').style.display = 'block';
            document.getElementById('create').style.display = 'block';
         }, 3000);
    }

    function nameTheTrip(){
        let tripName = document.getElementById('tripName').value;
        localStorage.setItem("searchValue", tripName);
    }

    return (
        <div>
            <nav className="navbar navbar-light bg-light static-top">
                <div className="container">

                    <a className="navbar-brand" href="#">GTravel</a>
        <img src="./assets/img/logo.jpg" alt="" className='img-thumbnail' style={{height:'100px', width: '100px'}}/>

                    <div id="loginsection" style={{ display: 'block' }}>
                        <a className="btn btn-primary" href="#" id='login'>Sign In</a>
                    </div>
                    <div id="logoutsection" style={{ display: 'none' }}>
                        <a className="btn btn-primary" href="#" id='logout'>Sign Out</a>
                    </div>
                </div>
            </nav>

            <header className="masthead text-white text-center">
                <div className="overlay"></div>
                <div className="container">
                    <div className="row">
                        <div className="col-xl-9 mx-auto">
                            <h1 className="mb-5">Plan your trip!</h1>
                        </div>
                        <div className="col-md-10 col-lg-8 col-xl-7 mx-auto">
                            <div className="form-row">
                                <div className="col-12 col-md-9 mb-2 mb-md-0">
                                    <input type="text" id="searchbox" className="form-control form-control-lg" placeholder="Enter a destination..." />
                                </div>
                                <div className="col-12 col-md-3">
                                    <button type="submit" id="submit_button" className="btn btn-block btn-lg btn-primary" onClick={submitcity}>Search!</button>
                                    <br />

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div style={{ width: 1000, height: 1000, float: 'right', position: 'absolute', right: 0 }} id="map"></div>


            <section className="container">
                <h3>Create a brand new itinerary by selecting what attractions you would like to visit</h3>
                <div className="attraction" id="attraction">

                </div>
                <div>
                    <Link to="/map">
                        <Button style={{ display: 'none', align: 'centre' }} id='create'>Create Itinerary</Button>
                    </Link>
                </div>


                <div id="namethetrip" style={{ display: 'none', align: 'centre' }} >
                    <input type="text" id="tripName" className="form-control form-control-lg" placeholder="Enter the trip name..." required/>
                    <Button id='naming' onClick={nameTheTrip}>Name your trip</Button>
                </div>
            </section>

            <div className="form-row">
                <div className="col-12 col-md-9 mb-2 mb-md-0">
                    <input id="startplace"

                        onChange={event => setQuery1(event.target.value)}
                        placeholder="Enter the start point"
                        value={query1}
                    />
                    <input id="endplace"

                        onChange={event => setQuery2(event.target.value)}
                        placeholder="Enter the end point"
                        value={query2}
                    />

                </div>
                <div className="col-12 col-md-3">
                    <button >Submit</button>
                </div>
            </div>

            <section className="features-icons bg-light text-center">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                                <div className="features-icons-icon d-flex">
                                    <img className="img-fluid rounded-circle mb-3" src="assets/img/destination.jpg" alt="" />
                                </div>
                                <h3>Choose your destination!</h3>
                                <p className="lead mb-0">Let us know where are you planning to spend your vacation</p>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                                <div className="features-icons-icon d-flex">
                                    <i className="icon-layers m-auto text-primary"></i>
                                </div>
                                <h3>Find the best attractions!</h3>
                                <p className="lead mb-0">Add to your to-do list the places you want to visit and find out amazing details about all of them</p>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="features-icons-item mx-auto mb-0 mb-lg-3">
                                <div className="features-icons-icon d-flex">
                                    <i className="icon-check m-auto text-primary"></i>
                                </div>
                                <h3>Generate your customizable itinerary!</h3>
                                <p className="lead mb-0">Vizualize on the Google Maps how your journey will look like to save time and visit everything you desire</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="testimonials text-center bg-light">
                <div className="container">
                    <h2 className="mb-5">What people are saying...</h2>
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="testimonial-item mx-auto mb-5 mb-lg-0">
                                <img className="img-fluid rounded-circle mb-3" src="img/testimonials-1.jpg" alt="" />
                                <h5>Margaret E.</h5>
                                <p className="font-weight-light mb-0">"This is fantastic! Thanks so much guys!"</p>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="testimonial-item mx-auto mb-5 mb-lg-0">
                                <img className="img-fluid rounded-circle mb-3" src="img/testimonials-2.jpg" alt="" />
                                <h5>Fred S.</h5>
                                <p className="font-weight-light mb-0">"The tool I always needed for my trips."</p>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="testimonial-item mx-auto mb-5 mb-lg-0">
                                <img className="img-fluid rounded-circle mb-3" src="img/testimonials-3.jpg" alt="" />
                                <h5>Sarah W.</h5>
                                <p className="font-weight-light mb-0">"All my vacations are perfect!"</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="call-to-action text-white text-center">
                <div className="overlay"></div>
                <div className="container">
                    <div className="row">
                        <div className="col-xl-9 mx-auto">
                            <h2 className="mb-4">Ready to get started? Sign up now!</h2>
                        </div>
                        <div className="col-md-10 col-lg-8 col-xl-7 mx-auto">
                            <form>
                                <div className="form-row">
                                    <div className="col-12 col-md-9 mb-2 mb-md-0">
                                        <input type="email" className="form-control form-control-lg" placeholder="Enter your email..." />
                                    </div>
                                    <div className="col-12 col-md-3">
                                        <button type="submit" className="btn btn-block btn-lg btn-primary">Sign up!</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="footer bg-light">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 h-100 text-center text-lg-left my-auto">
                            <ul className="list-inline mb-2">
                                <li className="list-inline-item">
                                    <a href="#">About</a>
                                </li>
                                <li className="list-inline-item">&sdot;</li>
                                <li className="list-inline-item">
                                    <a href="#">Contact</a>
                                </li>
                                <li className="list-inline-item">&sdot;</li>
                                <li className="list-inline-item">
                                    <a href="#">Create an itinerary</a>
                                </li>
                                <li className="list-inline-item">&sdot;</li>
                                <li className="list-inline-item">
                                    <a href="#">My Trips</a>
                                </li>
                            </ul>
                            <p className="text-muted small mb-4 mb-lg-0">&copy; GTravel 2020</p>
                        </div>
                        <div className="col-lg-6 h-100 text-center text-lg-right my-auto">
                            <ul className="list-inline mb-0">
                                <li className="list-inline-item mr-3">
                                    <a href="#">
                                        <i className="fa fa-facebook fa-2x fa-fw"></i>
                                    </a>
                                </li>
                                <li className="list-inline-item mr-3">
                                    <a href="#">
                                        <i className="fa fa-twitter-square fa-2x fa-fw"></i>
                                    </a>
                                </li>
                                <li className="list-inline-item">
                                    <a href="#">
                                        <i className="fa fa-instagram fa-2x fa-fw"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;