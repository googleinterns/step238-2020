import React, { Component } from 'react';
import { render } from 'react-dom';
import Map from './Map'

class Itinerary extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Map
                id="map"
                options={{
                    zoom: 13,
                    center: {
                        lat: 48.135,
                        lng: 11.582,
                    }
                }}
                onMapLoad={map => {
                    var marker = new window.google.maps.Marker({
                        position: { lat: 41.0082, lng: 28.9784 },
                        map: map,
                        title: 'Hello Istanbul!'
                    });
                }}
            />
        );
    }
}

export default Itinerary;
