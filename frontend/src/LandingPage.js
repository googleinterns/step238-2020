import React, { useState, useEffect, useRef } from "react";
import './App.css';
import { Client, Status } from "@googlemaps/google-maps-services-js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Link } from 'react-router-dom';
import { createBrowserHistory } from "history";
import SECRET_KEY from './config';
import ITINERARY_KEY from './configMap';
import Button from "react-bootstrap/Button";
import ReactDOM from 'react-dom';
import ImgKey from './configImg';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

let autoCompleteStart, autoCompleteEnd, currentUserId;
let latStart, latEnd, longStart, longEnd, url;

function LandingPage() {
    let google, map, markers, infowindows = [];
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
                markers.splice(i, 1);
                break;
            }
        }

        // Update the markers on map page.
        for (let i = 0; i < markers.length; i++) {
            markers[i].markerObject.setMap(map);
        }
    }
   
     function addMarker(location, description, attractionName) {
        // Convert string location to JSON object.   
        const position = {
            lat: parseFloat(location.split(',')[0]),
            lng: parseFloat(location.split(',')[1]),
        };
        map.setCenter(position);
 
        const infowindow = new google.maps.InfoWindow({
        content: description,
        maxWidth: 350
    });
        
        const markerObject = new google.maps.Marker({
            position: position,
        });
 
        const marker = {
            position: position,
            title: attractionName,
            markerObject: markerObject,
        }
 
        // Add new marker to the array.
        markers.push(marker);
        infowindows.push(infowindow);
 
        // Update markers on map page.
        for (let i = 0; i < markers.length; i++) {
            markers[i].markerObject.setMap(map);
            markers[i].markerObject.addListener("click", () => {
              infowindows[i].open(map, markers[i].markerObject);
        });
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
            label: "Food break",
            markerObject: markerObject,
        }

        // Add new marker to the array.
        markers.push(marker);

        // Update markers on map page.
        for (let i = 0; i < markers.length; i++) {
            markers[i].markerObject.setMap(map);
        }
    }
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
        handleLoadStartPoint(setqueryStart);
        handleLoadEndPoint(setqueryEnd);
        initMap();
    }

    const loadScript = (url) => {
        let script = document.createElement("script");
        script.type = "text/javascript";

        if (script.readyState) {
            script.onreadystatechange = function () {
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
    function handleLoadStartPoint(updateQuery) {
        autoCompleteStart = new window.google.maps.places.Autocomplete(
            document.getElementById("startplace"),
        );

        autoCompleteStart.addListener("place_changed", () =>
            handlePlaceSelectStart(updateQuery)
        );
    }
    function handleLoadEndPoint(updateQuery) {
        autoCompleteEnd = new window.google.maps.places.Autocomplete(
            document.getElementById("endplace")
        );

        autoCompleteEnd.addListener("place_changed", () =>
            handlePlaceSelectEnd(updateQuery)
        );
    }

    async function handlePlaceSelectStart(updateQuery) {
        let addressObject = autoCompleteStart.getPlace();

        latStart = addressObject.geometry.location.lat();
        longStart = addressObject.geometry.location.lng();

        let query = addressObject.formatted_address;
        updateQuery(query);
    }

    async function handlePlaceSelectEnd(updateQuery) {
        const addressObject = autoCompleteEnd.getPlace();

        latEnd = addressObject.geometry.location.lat();
        longEnd = addressObject.geometry.location.lng();

        const query = addressObject.formatted_address;
        updateQuery(query);
    }

    function nameTheTrip() {
        let tripName = document.getElementById('tripName').value;
        if (tripName !== undefined)
            localStorage.setItem("searchValue", tripName);
    }

    function submitOptional() {
        nameTheTrip();
        let url
        if (latStart !== undefined && localStorage["url"] !== undefined) {
            url = 'locations=' + latStart + "," + longStart + "*" + localStorage["url"].split("=")[1];
            localStorage.setItem("url", url);
        }
        if (latStart !== undefined && localStorage["url"] == undefined) {
            url = 'locations=' + latStart + "," + longStart;
            localStorage.setItem("url", url);
        }
        if (latEnd !== undefined) {
            if (localStorage["url"] !== undefined) {
                url = localStorage["url"] + "*" + latEnd + "," + longEnd;
                localStorage.setItem("url", url);
            }
            else {
                url = "locations=" + latEnd + "," + longEnd;
                localStorage.setItem("url", url);
            }
        }
    }

    const [queryStart, setqueryStart] = useState("");
    const [queryEnd, setqueryEnd] = useState("");

    function revertCity() {
        searchValue = localStorage["backupSearchValue"];

        searchValue.replace(/\s/g, '+');
        const key = Object.values(SECRET_KEY)[0];
        const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + searchValue +
            '&key=' + key;
        fetch(url)
            .then(response => response.json())
            .then(function (data) {
                const lat = data.results[0].geometry.location.lat;
                const lng = data.results[0].geometry.location.lng;
                const adress = '/api/attractions?lat=' + lat + '&long=' + lng;
                fetch(adress)
                    .then(response => response.json())
                    .then(function (attractions) {
                        setTimeout(function () {
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
                            listatt.innerHTML = '';
                            listatt.appendChild(listDiv);
                        }
                            , 200);
                    }
                    );
            })

    }

    function createRestaurantElem(attraction) {
        const liElement = document.createElement("li");
        liElement.id = 'attraction';
        let touristsview = '';

        const keyImg = Object.values(ImgKey)[0];
        let attrPhoto;
        if (attraction.photos[0] === undefined) {
            attrPhoto = '' + ' alt="no photo available"';
        } else {
            attrPhoto = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + attraction.photos[0].photo_reference + '&key=' + keyImg;
        }
        touristsview += '<img width="300" height="200" src=' + attrPhoto + '>' +
            '<br>' +
            '<strong id="rating">' + attraction.rating + '</strong>' +
            '<span id="total_rating">' + '(' + attraction.user_ratings_total + ')' + '</span>' +
            '<br>' +
            '<span id="name">' + attraction.name + '</span>' +
            '<br>';
        liElement.innerHTML = touristsview;

        const buttonAdd = document.createElement('button');
        buttonAdd.id = 'add-to-list';

        if (localStorage["url"] !== undefined) {
            const location = attraction.geometry.location.lat + "," + attraction.geometry.location.lng;
            if (localStorage["url"].includes(location)) {
                buttonAdd.innerText = "REMOVE";

                liElement.style.backgroundColor = 'green';
            }
            else {
                liElement.style.backgroundColor = '';
                buttonAdd.innerText = 'ADD';

            }
        }
        else {
            liElement.style.backgroundColor = '';
            buttonAdd.innerText = 'ADD';
        }

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
                liElement.style.backgroundColor = 'green';
            }
            else {
                liElement.style.backgroundColor = '';
                const location = attraction.geometry.location.lat + "," + attraction.geometry.location.lng;
                removeMarker(location);

                let url = localStorage["url"];
                let toDelete = '*' + location;

                url = url.replace(toDelete, "");//to delete the location if it's like *location;
                toDelete = toString(attraction.geometry.lng + "," + attraction.geometry.lat);
                url = url.replace(toDelete, ""); //to delete the location if it's the single location, or if it's the first one

                localStorage.setItem("url", url);

                buttonAdd.innerText = "ADD";
                liElement.style.backgroundColor = "white";

            }
        });
        liElement.appendChild(buttonAdd);
        return liElement;
    }

    function createListElem(attraction) {
        const liElement = document.createElement("li");
        liElement.id = 'attraction';
        let touristsview = '';

        const keyImg = Object.values(ImgKey)[0];

        touristsview += '<img width="300" height="200" src=' + 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + attraction.photos[0].photo_reference + '&key=' + keyImg + '>' +
            '<br>' +
            '<strong id="rating">' + attraction.rating + '</strong>' +
            '<span id="total_rating">' + '(' + attraction.user_ratings_total + ')' + '</span>' +
            '<br>' +
            '<strong id="name">' + attraction.name + '</strong>' +
            '<br>';

        liElement.innerHTML = touristsview;

        //this is only for attractions 
        const buttonRestaurants = document.createElement("button");
        buttonRestaurants.id = 'display-restaurants';
        buttonRestaurants.innerText = 'Restaurants nearby';
        buttonRestaurants.addEventListener("click", () => {
            const lat = attraction.geometry.location.lat;
            const lng = attraction.geometry.location.lng;

            const adress = "api/restaurants?lat=" + lat + "&long=" + lng;
            fetch(adress)
                .then(response => response.json())
                .then(function (data) {
                    const listatt = document.getElementById('attractionDiv');
                    const listDiv = document.createElement('div');
                    listDiv.className = 'row';
                    listDiv.innerHTML = '';

                    const removeButtonUp = document.createElement("button");
                    removeButtonUp.innerText = "Back";
                    removeButtonUp.addEventListener("click", () => {
                        revertCity();
                    })
                    removeButtonUp.backgroundColor = "cadetblue";


                    data.results.sort((a, b) => {
                        return b.user_ratings_total - a.user_ratings_total;
                    });

                    for (let i = 0; i < data.results.length; i++) {
                        listDiv.appendChild(createRestaurantElem(data.results[i]));
                    }

                    const removeButtonDown = document.createElement("button");
                    removeButtonDown.innerText = "Back";
                    removeButtonDown.addEventListener("click", () => {
                        revertCity();
                    })
                    removeButtonDown.backgroundColor = "cadetblue";

                    listatt.innerHTML = '';
                    listatt.appendChild(removeButtonUp);
                    listatt.appendChild(listDiv);
                    listatt.appendChild(removeButtonDown);
                })

        })

        const buttonAdd = document.createElement('button');
        buttonAdd.id = 'add-to-list';
        if (localStorage["url"] !== undefined) {
            const location = attraction.geometry.location.lat + "," + attraction.geometry.location.lng;
            if (localStorage["url"].includes(location)) {
                buttonAdd.innerText = "REMOVE";
                liElement.style.backgroundColor = "green";
            }
            else {
                buttonAdd.innerText = 'ADD';
                liElement.style.backgroundColor = '';
            }

        }
        else {
            buttonAdd.innerText = 'ADD';
            liElement.style.backgroundColor = '';
        }

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
                const location = attraction.geometry.location.lat + "," + attraction.geometry.location.lng;
                url += location;

                localStorage.setItem("url", url);
                buttonAdd.innerText = "REMOVE";

                let attractionName = buttonAdd.parentElement.children[5].innerText;
                attractionName = attractionName.replace(/\s/g, "_");

                fetch(`api/webscrapper?attractionName=${attractionName}`, {
                    method: 'GET'
                }).then((response) => response.json())
                    .then((description) => addMarker(location, description, attractionName))

            }
            else {
                liElement.style.backgroundColor = '';
                const location = attraction.geometry.location.lat + "," + attraction.geometry.location.lng;
                removeMarker(location);

                let url = localStorage["url"];
                let toDelete = '*' + location;

                url = url.replace(toDelete, "");//to delete the location if it's like *location;
                toDelete = toString(attraction.geometry.lng + "," + attraction.geometry.lat);
                url = url.replace(toDelete, ""); //to delete the location if it's the single location, or if it's the first one

                localStorage.setItem("url", url);

                buttonAdd.innerText = "ADD";
                liElement.style.backgroundColor = "";


            }
        });
        liElement.appendChild(buttonAdd);
        liElement.appendChild(buttonRestaurants);
        return liElement;
    }

    let searchValue;

    function submitcity() {

        let searchValue = document.getElementById('searchbox').value;

        if (localStorage["searchValue"] === searchValue) {
            localStorage.removeItem("url");
        } else { localStorage.setItem("searchValue", searchValue); }

        markers = [];

        //this is for getting the list back after using restaurants;
        localStorage.setItem("backupSearchValue", searchValue);
        searchValue.replace(/\s/g, '+');
        const key = Object.values(ITINERARY_KEY)[0];
        const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + searchValue +
            '&key=' + key;
        fetch(url)
            .then(response => response.json())
            .then(function (data) {
                const lat = data.results[0].geometry.location.lat;
                const lng = data.results[0].geometry.location.lng;
                const adress = '/api/attractions?lat=' + lat + '&long=' + lng;
                fetch(adress)
                    .then(response => response.json())
                    .then(function (attractions) {
                        setTimeout(function () {
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
                buttonLocation.innerHTML = "<p>Previous created trips</p>" + "<br/>" + "<br/>";
                //we create the buttons
                for (let i = 0; i < trips.length; i++) {
                    const button = document.createElement("button");
                    button.innerText = trips[i].tripName;
                    button.style.backgroundColor = "cadetblue";
                    button.style.color = "aliceblue";
                    let currentUrl = trips[i].tripID === undefined ? 'locations=' : trips[i].tripID;
                    button.id = trips[i].id;
                    button.addEventListener("click", e => {
                        callLoad(currentUrl)
                    })
                    buttonLocation.appendChild(button);

                    //we add the delete button
                    const buttondel = document.createElement("button");
                    buttondel.innerText = "remove trip";
                    buttondel.id = trips[i].timestamp;
                    buttondel.addEventListener("click", function () {
                        //we first delete the button with the url
                        const params = new URLSearchParams();
                        params.append("id", trips[i].id);
                        fetch(
                            'api/delete', {
                            method: 'post',
                            body: params
                        })

                        document.getElementById(trips[i].id).remove();
                        document.getElementById(trips[i].timestamp).remove();
                        //then we delete it from the database 

                    });
                    buttonLocation.appendChild(buttondel);
                }
            })
    }
    function callLoad(currentUrl) {
        localStorage.setItem("url", currentUrl);
        window.location.href = "/map";

    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            submitcity();
        }
    }

    function sendDate(date) {
        // Split the date and take day, year and month parameters.
        date = String(date).split(" ");
        const day = date[2];
        const year = date[3];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nove", "Dec"];
        const month = months.indexOf(date[1]);

        // Convert to timestamp and set time at 12pm.
        const timestamp = new Date(year, month, day).getTime() / 1000 + 54000;

        // Always put the date parameter just before the locations parameter.
        let url = localStorage["url"];
        if (url == undefined) {
            url = "date=" + timestamp + "&";
        } else {
            url = "date=" + timestamp + "&" + url;
        }
        localStorage.setItem("url", url);
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
                                    <input type="text" id="searchbox" className="form-control form-control-lg" placeholder="Enter a destination..." onKeyPress={handleKeyPress}/>
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

            <section>
                <p>Create a brand new itinerary by selecting what attractions you would like to visit, after searching the desired city</p>
                 <div className="row">
                    <div className="col-lg-8">
                        <div id="attractionDiv">
 
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div style={{ maxWidth: 1000, maxHeight: 1000, float: 'right', right: 0 }} id="map"></div>
                    </div>
                </div>

                <div className="optionalForm" id="optionalForm" style={{ display: 'none', align: 'centre' }}>
                    <input id="startplace"

                        onChange={event => setqueryStart(event.target.value)}
                        placeholder="Enter your hotel or the start point of trip"
                        value={queryStart}
                    />
                    <input id="endplace"

                        onChange={event => setqueryEnd(event.target.value)}
                        placeholder="Enter your hotel or the end point of trip"
                        value={queryEnd}
                    />

                    <DayPickerInput id="date" onDayChange={day => sendDate(day)} />

                    <input type="text" id="tripName" className="form-control form-control-lg" placeholder="Enter the trip name..." required />
                </div>

                <br />
                <div style={{ width: 1000, height: 1000, float: 'left', left: 0, border: '1px solid black' }} id="predefined-trips">
                    <ul>

                        <li id="trip">
                            <img width="300" height="200" src={require("./assets/img/munich.jpg")}></img>
                            <br></br>
                            <strong id="name">Munich</strong>
                            <br></br>
                            <button onClick={() => callLoad("locations=48.1376098,11.5799253*48.17546460000001,11.551797*48.1298707,11.5834522*48.1768304,11.5590966*48.1582675,11.5033143*48.1364483,11.5784741")}>View Trip</button>
                        </li>
                        <li id="trip">
                            <img width="300" height="200" src={require("./assets/img/moscow.jpg")}></img>
                            <br></br>
                            <strong id="name">Moscow</strong>
                            <br></br>
                            <button onClick={() => callLoad("locations=55.75393030000001,37.620795*55.75202329999999,37.6174994*55.7446375,37.6054939*55.76013349999999,37.6186486*55.74730539999999,37.6051125*55.7621915,37.6225439")}>View Trip</button>
                        </li>
                        <li id="trip">
                            <img width="300" height="200" src={require("./assets/img/bucharest.jpg")}></img>
                            <br></br>
                            <strong id="name">Bucharest</strong>
                            <br></br>
                            <button onClick={() => callLoad("locations=44.4078713,26.105064*44.4531131,26.0846382*44.4411651,26.0971299*44.4045728,26.1152452*44.43936679999999,26.09587400000001*44.4104938,26.1124879")}>View Trip</button>
                        </li>
                        <li id="trip">
                            <img width="300" height="200" src={require("./assets/img/istanbul.jpg")}></img>
                            <br></br>
                            <strong id="name">Istanbul</strong>
                            <br></br>
                            <button onClick={() => callLoad("locations=41.01650009999999,28.9705194*41.02566780000001,28.97412869999999*41.0115195,28.98337889999999*41.008583,28.980175*41.0054096,28.9768138*41.0080365,28.9767431")}>View Trip</button>
                        </li>
                        <li id="trip">
                            <img width="300" height="200" src={require("./assets/img/rome.jpg")}></img>
                            <br></br>
                            <strong id="name">Rome</strong>
                            <br></br>
                            <button onClick={() => callLoad("locations=41.8914252,12.5152192*41.87351719999999,12.5015034*41.8993212,12.4767522*41.9044205,12.4944377*41.9045479,12.479361*41.906361,12.489744")}>View Trip</button>
                        </li>
                        <li id="trip">
                            <img width="300" height="200" src={require("./assets/img/newyork.jpg")}></img>
                            <br></br>
                            <strong id="name">New York</strong>
                            <br></br>
                            <button onClick={() => callLoad("locations=40.7579747,-73.9855426*40.7587402,-73.9786736*40.703141,-74.0159996*40.7614327,-73.97762159999999*40.6953752,-73.99968439999999*40.757498,-73.986654")}>View Trip</button>
                        </li>
                        <li id="trip">
                            <img width="300" height="200" src={require("./assets/img/london.jpg")}></img>
                            <br></br>
                            <strong id="name">London</strong>
                            <br></br>
                            <button onClick={() => callLoad("locations=51.503324,-0.119543*51.5194133,-0.1269566*51.50811239999999,-0.0759493*51.5230174,-0.1543613*51.4978095,-0.1745235*51.5114838,-0.1323114")}>View Trip</button>
                        </li>

                        <li id="trip">
                            <img width="300" height="200" src={require("./assets/img/paris.jpg")}></img>
                            <br></br>
                            <strong id="name">Paris</strong>
                            <br></br>
                            <button onClick={() => callLoad("locations=48.85837009999999,2.2944813*48.8606111,2.337644*48.88670459999999,2.3431043*48.8599614,2.3265614*48.85296820000001,2.3499021*48.86401059999999,2.3059374")}>View Trip</button>
                        </li>
                    </ul>
                </div>
                <div style={{ width: 1000, height: 1000, float: 'right', position: 'absolute', right: 0 }} id="map"></div>

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