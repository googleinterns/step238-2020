'use strict';
/* eslint-disable no-unused-vars */

/** Initialize the Map View */
function initMap() {
  // The input coordinates separated by asterisk (*), also for each coordinates latitude and longitude is seperated by comma (,).
  // Example: trip.html?locations=48.13237830000001,11.5865944*48.14127879999999,11.5652331*48.1472299,11.5737519*48.1376098,11.5799253*48.17315919999999,11.5466036*48.13237830000001,11.5865944
  const urlParameters = getFromUrl();
  // Select the center of map using first destination.
  const centerPoint = urlParameters.locations.split('*')[0];

  const centerLat = parseFloat(centerPoint.split(',')[0]);
  const centerLong = parseFloat(centerPoint.split(',')[1]);

  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {
      lat: centerLat,
      lng: centerLong,
    },
  });
  directionsRenderer.setMap(map);
  const body = document.getElementsByTagName('body')[0];
  body.addEventListener('load',
    calculateAndDisplayRoute(directionsService, directionsRenderer), false);
}

/** Calculate and display the itinerary
* @param {directionsService} directionsService Direction API parameter.
* @param {directionsRenderer} directionsRenderer Direction API parameter.
*/
function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  const urlParameters = getFromUrl();
  const locations = urlParameters.locations.split('*');
  let waypts = [];

  const start = locations[0];
  const finish = locations[locations.length - 1];

  for (let i = 1; i < locations.length - 1; i++) {
    waypts.push({
      location: locations[i],
      stopover: true,
    });
  }

  directionsService.route(
    {
      origin: start,
      destination: finish,
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
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
}

/** Parse the url query for getting parameters
* @param {String} query URL query after the question mark.
*/
function parse_query_string(query) {
  const vars = query.split("&");
  let query_string = {};

  for (var i = 0; i < vars.length; i++) {

    const pair = vars[i].split("=");
    const key = decodeURIComponent(pair[0]);
    const value = decodeURIComponent(pair[1]);
    query_string[key] = value;
  }
  return query_string;
}

/** Look url and get locations for itinerary*/
function getFromUrl() {
  // URL query after the question mark.
  const query = window.location.search.substring(1);

  const parsedQuery = parse_query_string(query);
  return parsedQuery;
}
