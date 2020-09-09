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
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

let autoComplete1, autoComplete2, currentUserId;
let lat1, lat2, long1, long2, url;

function LandingPage() {

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
            document.getElementById("startplace"),
        );

        autoComplete1.addListener("place_changed", () =>
            handlePlaceSelect1(updateQuery)
        );
    }
    function handleScriptLoad2(updateQuery) {
        autoComplete2 = new window.google.maps.places.Autocomplete(
            document.getElementById("endplace")
        );

        autoComplete2.addListener("place_changed", () =>
            handlePlaceSelect2(updateQuery)
        );
    }

    async function handlePlaceSelect1(updateQuery) {
        let addressObject1 = autoComplete1.getPlace();

        lat1 = addressObject1.geometry.location.lat();
        long1 = addressObject1.geometry.location.lng();

        let query1 = addressObject1.formatted_address;
        updateQuery(query1);
    }

    async function handlePlaceSelect2(updateQuery) {
        const addressObject2 = autoComplete2.getPlace();

        lat2 = addressObject2.geometry.location.lat();
        long2 = addressObject2.geometry.location.lng();

        const query2 = addressObject2.formatted_address;
        updateQuery(query2);
    }

    function nameTheTrip() {
        let tripName = document.getElementById('tripName').value;
        if (tripName !== undefined)
            localStorage.setItem("searchValue", tripName);
    }

    function submitOptional() {
        nameTheTrip();
        url = 'locations=*' + lat1 + ',' + long1;

    }

    const [query1, setQuery1] = useState("");
    const [query2, setQuery2] = useState("");

    useEffect(() => {
        loadScript(
            `https://maps.googleapis.com/maps/api/js?key=` + Object.values(ITINERARY_KEY)[0] + `&libraries=places`
        );
        authentication();
    }, []);

    function createListElem(attraction) {
        const liElement = document.createElement("li");
        liElement.id = 'attraction';
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
            '<strong id="name">' + attraction.name + '</strong>' +
            '<br>' +
            '<span id="timetable">' + 'Opened: ' + open + '</span>';

        liElement.innerHTML = touristsview;
        const buttonAdd = document.createElement('button');
        buttonAdd.id = 'add-to-list';
        buttonAdd.innerText = 'ADD';
        buttonAdd.addEventListener('click', () => {
            if (buttonAdd.innerText == "ADD") {
                liElement.style.backgroundColor = 'green';
                url = localStorage["url"];
                //it should be something like locations=
                if (url === undefined) {
                    url = 'locations=';

                }
                else
                    url += "*";
                url += attraction.geometry.location.lat + "," + attraction.geometry.location.lng;
                localStorage.setItem("url", url);
                buttonAdd.innerText = "REMOVE";
            }
            else {
                url = localStorage["url"];
                let toDelete = '*' + attraction.geometry.location.lat + "," + attraction.geometry.location.lng;

                url.replace(toDelete, "");//to delete the location if it's like *location;
                toDelete = toString(attraction.geometry.lng + "," + attraction.geometry.lat);
                url.replace(toDelete, ""); //to delete the location if it's the single location, or if it's the first one

                localStorage.setItem("url", url);

                buttonAdd.innerText = "ADD";
                liElement.style.backgroundColor = 'red';
            }
        });
        liElement.appendChild(buttonAdd);
        return liElement;
    }

    let searchValue;
    function submitcity() {
        searchValue = document.getElementById('searchbox').value;
        localStorage.setItem("searchValue", searchValue);
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
                            const listatt = document.getElementById('attractionDiv');
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
        document.getElementById('create').style.display = 'block';
        document.getElementById('optionalForm').style.display = 'block';


    }



    function getSavedItinerary() {
        fetch(`/api/database?userID=${localStorage["id"]}`, {
            method: 'GET'
        }).then((response) => response.json())
            .then((trips) => {
                let index = 0;

                if (localStorage["index"] === undefined)
                    localStorage.setItem("index", trips.length - 1);

                // we get the buttons location
                let buttonLocation = document.getElementById("saved");
                // delete all the previous buttons
                buttonLocation.innerHTML = "<p>Previous created trips</p>";
                //we create the buttons
                for (let i = 0; i < trips.length; i++) {
                    const button = document.createElement("button");
                    button.innerText = trips[i].tripName;
                    button.style.backgroundColor = "cadetblue";
                    button.style.color = "aliceblue";
                    let currentUrl = trips[i].tripID === undefined ? 'locations=' : trips[i].tripID;
                    button.id = currentUrl;
                    button.addEventListener("click", e => {
                        callLoad(currentUrl)
                    })
                    buttonLocation.appendChild(button);
                }
                //we add the delete button
                const button = document.createElement("button");
                button.innerText = "remove trip";
                button.addEventListener("click", function() {
                    //we first delete the button with the url
                    document.getElementById(localStorage["url"]).remove();
                    //then we delete it from the database 
                    const params = new URLSearchParams();
                    params.append('tripID', localStorage["url"]);
                    fetch(
                        'api/delete', {
                        method: 'post',
                        body: params
                    }
                    )
                });
                buttonLocation.appendChild(button);
            });
    }
    function callLoad(currentUrl) {
        localStorage.setItem("url", currentUrl);
        window.location.href = "/map";
    }


    return (
        <div>
            <nav className="navbar navbar-light bg-light static-top">
                <div className="container">
                    <img src={require("./assets/img/logo.jpg")} alt="" className="img-fluid" style={{ height: '70px', width: '70px', animation: 'spin 2s infinite' }} />
                    <a className="navbar-brand" href="#">GTravel</a>

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

            <section className="container">
                <p>Create a brand new itinerary by selecting what attractions you would like to visit, after searching the desired city</p>
                <div id="attractionDiv">

                </div>

                <br />

                <div className="optionalForm" id="optionalForm" style={{ display: 'none', align: 'centre' }}>
                    <input id="startplace"

                        onChange={event => setQuery1(event.target.value)}
                        placeholder="Enter your hotel or the start point of trip"
                        value={query1}
                    />
                    <input id="endplace"

                        onChange={event => setQuery2(event.target.value)}
                        placeholder="Enter your hotel or the end point of trip"
                        value={query2}
                    />

                    <DayPickerInput onDayChange={day => console.log(day)} />

                    <input type="text" id="tripName" className="form-control form-control-lg" placeholder="Enter the trip name..." required />
                </div>

                <br />

                <div class="ofb">
                    <Link to="/map">
                        <Button style={{ display: 'none', align: 'centre' }} id='create' onClick={submitOptional}>Create Itinerary</Button>
                    </Link>
                </div>
            </section>

            <section className="features-icons bg-light text-center">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                                <div className="features-icons-icon d-flex">
                                    <img className="img-fluid" src={require("./assets/img/destination.jpg")} alt="" />
                                </div>
                                <h3>Choose your destination!</h3>
                                <p className="lead mb-0">Let us know where are you planning to spend your vacation</p>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                                <div className="features-icons-icon d-flex">
                                    <img className="img-fluid" src={require("./assets/img/attraction.jpg")} alt="" />
                                </div>
                                <h3>Find the best attractions!</h3>
                                <p className="lead mb-0">Add to your to-do list the places you want to visit and find out amazing details about all of them</p>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="features-icons-item mx-auto mb-0 mb-lg-3">
                                <div className="features-icons-icon d-flex">
                                    <img className="img-fluid" src={require("./assets/img/itinerary.jpg")} alt="" />
                                </div>
                                <h3>Generate your customizable itinerary!</h3>
                                <p className="lead mb-0">Visualize on the Google Maps how your journey will look like to save time and visit everything you desire</p>
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
                                <img className="img-fluid rounded-circle mb-3" src={require("./assets/img/person1.jpg")} alt="" />
                                <h5>Margaret E.</h5>
                                <p className="font-weight-light mb-0">"This is fantastic! Thanks so much guys!"</p>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="testimonial-item mx-auto mb-5 mb-lg-0">
                                <img className="img-fluid rounded-circle mb-3" src={require("./assets/img/person2.jpg")} alt="" />
                                <h5>Fred S.</h5>
                                <p className="font-weight-light mb-0">"The tool I always needed for my trips."</p>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="testimonial-item mx-auto mb-5 mb-lg-0">
                                <img className="img-fluid rounded-circle mb-3" src={require("./assets/img/person3.jpg")} alt="" />
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

            <div id="saved">

            </div>

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
                                    <a href="#saved" onClick={getSavedItinerary}>My Trips</a>
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
