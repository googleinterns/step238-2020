import React, { Component } from 'react';
import Map from './Map'

class Itinerary extends Component {

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

            />
        );
    }
}

export default Itinerary;
