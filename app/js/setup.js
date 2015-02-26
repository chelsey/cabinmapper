// Continent list hash of hashes
var continents = {
    'africa':    { lat: -16, lng: 25, zoom: 4 },
    'nAmerica':  { lat: 40, lng: -104, zoom: 5 },
    'sAmerica':  { lat: -30, lng: -65, zoom: 4 },
    'europe':    { lat: 46, lng: 6, zoom: 5 },
    'australia': { lat: -32, lng: 140, zoom: 4 },
    'asia':      { lat: 33, lng: 120, zoom: 5 },
    'antartica': { lat: -75, lng: -65, zoom: 3 },
    'nZed':      { lat: -43.595, lng: 170.1416666, zoom: 7 }
  },

  initialSetup = {
    // Setup for the Fusion Table
    tableId: '1wyZt40op_meNqhbXRau8POam0GzvWa3MKmUHR9KC',
    querySelection: 'lat',
    icon: 'schools',

    // Custom styling for the google map
    styling: moonriseKingdomStyles
  };

// Function to determine the initial center & zoom map view
// @param continent [String] The continent passed in at runtime
// @return [Object Literal] The center, zoom, zoomcontrol for the map view on load
var initialView = function initialView (continent) {
  var userCookieLat = cookie.read('userLat'),
    userCookieLng = cookie.read('userLng'),
    lat,
    lng,
    zoom;

  if (userCookieLat) {
    lat = userCookieLat
    lng = userCookieLng
    zoom = 8
  }
  else {
    lat = continents[continent].lat
    lng = continents[continent].lng
    zoom = continents[continent].zoom
  }

  return {
    center: new google.maps.LatLng(lat, lng),
    zoom: zoom,
    zoomControl: true
  }
};