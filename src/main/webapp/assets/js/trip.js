"use strict";

function initMap() {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: {
      lat: 48.135,
      lng: 11.582
    }
  });
  directionsRenderer.setMap(map);
  var body = document.getElementsByTagName("body")[0];
  body.addEventListener("load", calculateAndDisplayRoute(directionsService, directionsRenderer), false);
  
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {

  const waypts = [];
  waypts.push({
    location: "48.13237830000001,11.5865944",
    stopover: true
  });
  waypts.push({
    location: "48.14127879999999,11.5652331",
    stopover: true
  });
  waypts.push({
    location: "48.1472299,11.5737519",
    stopover: true
  });
  waypts.push({
    location: "48.1376098,11.5799253",
    stopover: true
  });
  waypts.push({
    location: "48.17315919999999,11.5466036",
    stopover: true
  });

  directionsService.route(
    {
      origin: "48.139148,11.580039",
      destination: "48.139148,11.580039",
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING
    },
    (response, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(response);
        const route = response.routes[0];
        const summaryPanel = document.getElementById("directions-panel");
        summaryPanel.innerHTML = ""; // For each route, display summary information.

        for (let i = 0; i < route.legs.length; i++) {
          const routeSegment = i + 1;
          summaryPanel.innerHTML +=
            "<b>Route Segment: " + routeSegment + "</b><br>";
          summaryPanel.innerHTML += route.legs[i].start_address + " to ";
          summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
          summaryPanel.innerHTML +=
            route.legs[i].distance.text + "<br><br>";
        }
      } else {
        window.alert("Directions request failed due to " + status);
      }
    }
  );
}
