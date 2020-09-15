import React, { Component } from 'react';
import { render } from 'react-dom';
import ITINERARY_KEY from "./configMap";
import WEATHER_KEY from "./configWeather";
import './Itinerary.css';
import Button from "react-bootstrap/Button";

class Map extends Component {

    constructor(props) {
        super(props);
        this.onScriptLoad = this.onScriptLoad.bind(this);
        this.getSavedItinerary = this.getSavedItinerary.bind(this);
        this.deleteItinerary = this.deleteItinerary.bind(this);
        this.saveUserItinerary = this.saveUserItinerary.bind(this);
        this.callLoad = this.callLoad.bind(this);
        this.m_get_directions_route = this.m_get_directions_route.bind(this);
    }
    onScriptLoad() {
        const map = new window.google.maps.Map(
            document.getElementById(this.props.id),
            this.props.options);

        let query = localStorage["url"];
        let vars = query.split("&");
        let query_string = {};

        for (var i = 0; i < vars.length; i++) {
            const pair = vars[i].split("=");
            const key = decodeURIComponent(pair[0]);
            const value = decodeURIComponent(pair[1]);
            query_string[key] = value;
        }

        let urlParameters = query_string;

        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);

        let waypts = [];
        query = localStorage["url"];
        vars = query.split("&");

        query_string = {};

        for (var i = 0; i < vars.length; i++) {

            const pair = vars[i].split("=");
            const key = decodeURIComponent(pair[0]);
            const value = decodeURIComponent(pair[1]);
            query_string[key] = value;
        }

        urlParameters = query_string;

        const locations = urlParameters.locations.split('*');

        const start = locations[0];
        const finish = locations[locations.length - 1];

        for (let i = 1; i < locations.length - 1; i++) {
            waypts.push({
                location: locations[i],
                stopover: true,
            });
        }


        if (urlParameters.date != undefined) {
            const datetime = urlParameters.date;
            const lat = start.split(',')[0];
            const long = start.split(',')[1];
            const key = Object.values(WEATHER_KEY)[0];

            // Create the API url for starting point.
            let url = 'https://api.openweathermap.org/data/2.5/onecall?lat=';
            url += lat;
            url += '&lon=';
            url += long;
            url += '&exclude=current,minutely,hourly&appid=';
            url += key;

            // Call the API for 8 days weather forecast.
            fetch(url)
                .then(response => response.text())
                .then(response => JSON.parse(response))
                .then(function(response) {
                    let weatherDiv = document.getElementById('weather');
                    response = response.daily;
                    // Find the correct datetime range for date parameter that came from landing page.
                    for (let i = 0; i < response.length - 1; i++) {

                        if (response[i].dt <= datetime &&
                            datetime <= response[i+1].dt) {
                                // Show the correct day's weather forecast.
                                weatherDiv.innerHTML = Math.floor(response[i].temp.day - 273.15);
                                weatherDiv.innerHTML += "°C " + response[i].weather[0].main;
                                break;
                            }
                    }
                });
        }

        let delayFactor = 0;
        let request = {
            origin: start,
            destination: finish,
            waypoints: waypts,
            optimizeWaypoints: true,
            travelMode: window.google.maps.TravelMode.DRIVING
        };

        this.m_get_directions_route(delayFactor, request, directionsRenderer, directionsService);

        this.props.onMapLoad(map)
    }

    m_get_directions_route(delayFactor, request, directionsRenderer, directionsService) {
        directionsService.route(
            request,
            (response, status) => {
                if (status === 'OK') {
                    directionsRenderer.setDirections(response);
                    const route = response.routes[0];

                    const summaryPanel = document.getElementById('directions-panel');
                    summaryPanel.innerHTML = '';

                    for (let i = 0; i < route.legs.length; i++) {
                        let infoWindow = new window.google.maps.InfoWindow();

                        infoWindow.setContent(route.legs[i].start_address);

                        // infoWindow.open(map);

                        const routeSegment = i + 1;
                        summaryPanel.innerHTML +=
                            '<b>Route Segment: ' + routeSegment + '</b><br>';
                        summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
                        summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
                        summaryPanel.innerHTML +=
                            route.legs[i].distance.text + '<br><br>';
                    }
                } else if (status === window.google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
                    delayFactor++;
                    setTimeout(function() {
                        this.m_get_directions_route();
                    }, delayFactor * 1000);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            },
        )
    };

    componentDidMount() {
        if (!window.google) {
            const key = Object.values(ITINERARY_KEY)[0];
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = `https://maps.google.com/maps/api/js?key=` + key;
            document.head.appendChild(s);
            s.addEventListener('load', e => {
                this.onScriptLoad()
            })
        } else {
            this.onScriptLoad();
        }
    }

    saveUserItinerary() {
        const params = new URLSearchParams();
        params.append('userID', localStorage["id"]);
        params.append('tripID', localStorage["url"]);
        params.append('tripName', localStorage["searchValue"]);
        fetch('/api/database', {
            method: 'POST',
            body: params
        });
        document.getElementById("save").innerText = "Trip " + localStorage["searchValue"] + " was saved";
        document.getElementById("save").style.backgroundColor = "green";
    }

    getSavedItinerary() {
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
                buttonLocation.innerHTML = "<h4>Previous created trips</h4>";
                //we create the buttons
                for (let i = 0; i < trips.length; i++) {
                    const button = document.createElement("button");
                    button.innerText = trips[i].tripName;
                    button.style.backgroundColor = "cadetblue";
                    button.style.color = "aliceblue";
                    let currentUrl = trips[i].tripID === undefined ? 'locations=' : trips[i].tripID;
                    button.id = currentUrl;
                    button.addEventListener("click", e => {
                        this.callLoad(currentUrl)
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
    callLoad(currentUrl) {
        localStorage.setItem("url", currentUrl);
        this.onScriptLoad();
    }

    deleteItinerary() {
        const params = new URLSearchParams();
        params.append('tripID', localStorage["url"]);
        fetch(
            'api/delete', {
            method: 'post',
            body: params
        }
        )
    }

    render() {
        return (
            <div>

                <div id="left-panel">
                    <div id="weather"></div>
                    <div id="directions-panel"></div>
                    
                    <br />
                    <br />
                    <br />
                    <div id="saved"></div>
                </div>
                <h1 id="title">My Itinerary</h1>
                <div class="mapbtn">
                    <Button id='save' onClick={this.saveUserItinerary}>Save this itinerary</Button>
                    <Button id='prev' onClick={this.getSavedItinerary} href="#saved">Previous trips</Button>
                </div>
                <div style={{ width: 1000, height: 800, float: 'left', position: 'absolute', left: '35%' }} id={this.props.id}></div>
            </div>
        );
    }
}

export default Map;