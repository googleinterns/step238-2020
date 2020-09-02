import React, { Component } from 'react';
import { render } from 'react-dom';
import ITINERARY_KEY from "./configMap";
import WEATHER_KEY from "./configWeather";
import './Itinerary.css';

class Map extends Component {
    constructor(props) {
        super(props);
        this.onScriptLoad = this.onScriptLoad.bind(this)
    }
    onScriptLoad() {
        const map = new window.google.maps.Map(
        document.getElementById(this.props.id),
        this.props.options);

        let query = window.location.search.substring(1);
        let vars = query.split("&");
        let query_string = {};

        for (var i = 0; i < vars.length; i++) {

            const pair = vars[i].split("=");
            const key = decodeURIComponent(pair[0]);
            const value = decodeURIComponent(pair[1]);
            query_string[key] = value;
        }
        let urlParameters = query_string;
        const centerPoint = urlParameters.locations.split('*')[0];

        const centerLat = parseFloat(centerPoint.split(',')[0]);
        const centerLong = parseFloat(centerPoint.split(',')[1]);

        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);
        
        let waypts = [];
        query = window.location.search.substring(1);
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

        // Check if date is defined
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


        directionsService.route(
            {
                origin: start,
                destination: finish,
                waypoints: waypts,
                optimizeWaypoints: true,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (response, status) => {
                if (status === 'OK') {
                    directionsRenderer.setDirections(response);
                    const route = response.routes[0];

                    const summaryPanel = document.getElementById('directions-panel');
                    summaryPanel.innerHTML = '';

                    for (let i = 0; i < route.legs.length; i++) {
                        const routeSegment = i + 1;
                        summaryPanel.innerHTML +=
                            '<b>Route Segment: ' + routeSegment + '</b><br>';
                        summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
                        summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
                        summaryPanel.innerHTML +=
                            route.legs[i].distance.text + '<br><br>';
                    }
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            },
        );


        this.props.onMapLoad(map)
    }

    componentDidMount() {
        if (!window.google) {
            const key = Object.values(ITINERARY_KEY)[0];
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = `https://maps.google.com/maps/api/js?key=`+key;
            document.head.appendChild(s);
            s.addEventListener('load', e => {
                this.onScriptLoad()
            })
        } else {
            this.onScriptLoad()
        }
    }

    render() {
        return (
            <div>
                <div id="left-panel">
                    <div id="weather"></div>
                    <div id="directions-panel"></div>
                    
                </div>
                <h1 id="title">My Itinerary</h1>
                <div style={{ width: 1000, height: 800, float: 'left', position: 'absolute', right: 60 }} id={this.props.id}></div>
            </div>
        );
    }
}

export default Map;