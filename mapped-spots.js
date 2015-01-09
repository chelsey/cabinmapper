// Continent List
var continentList = {
  "africa": { lat: -16, lng: 25, zoom: 4 },
  "nAmerica": { lat: 40, lng: -104, zoom: 5 },
  "sAmerica": { lat: -30, lng: -65, zoom: 4 },
  "europe": { lat: 46, lng: 6, zoom: 5 },
  "australia": { lat: -32, lng: 140, zoom: 4 },
  "asia": { lat: 33, lng: 120, zoom: 5 },
  "antartica": { lat: -75, lng: -65, zoom: 3 },
  "nZed": { lat: -43.595, lng: 170.1416666, zoom: 7 },
};

// Setup for the Fusion Table
var tableSetup = {
  tableid: "1Ay8W3xm9KDz-gbyoWe9Gcax-lUe_hEkDgOtiSdYW",
  tableSelection: "lat",
  icon: "schools"
};

// Initial options set for map
var initialMapOptions = {
  center: new google.maps.LatLng(continentList.nZed.lat, continentList.nZed.lng),
  zoom: continentList.nZed.zoom,
  zoomControl: true,
  zoomControlOptions: {
    position: google.maps.ControlPosition.LEFT_BOTTOM
  }
};

// Initialize map
function initialize() {
  var styledMap = new google.maps.StyledMapType(moonriseKingdomStyles);
  var map = new google.maps.Map(document.getElementById("map-canvas-div"), initialMapOptions);

  // Associate the styled map with the MapTypeId and set it to display.
  map.mapTypes.set("map_style", styledMap);
  map.setMapTypeId("map_style");

  // Select our data points using SQL-like syntax courtesy of the Google FT API
  var layer = new google.maps.FusionTablesLayer({
    query: {
      select: tableSetup.querySelection,
      from: tableSetup.tableid
    },
    styles: [{
      markerOptions: {
        iconName: tableSetup.icon
      }
    }],
    map: map
  });

  // If navigator.geolocation, use that as initialMapOptions

  // Geolocation - in case someone wants to go to their current location and browse around nearby
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition( function(position) {
      userLatLong = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      initialMarker = new google.maps.Marker({
        position: userLatLong,
        map: map,
        icon: 'http://www.google.com/mapfiles/ms/micons/orange.png',
        title: "You're here"
      });
      map.setCenter(userLatLong);
    });
  }

  // Geolocation - the centering when someone clicks on a specific continent from the DOM dropdown
  $(".specific-continent").on('click', function() {
    var continentClicked = continentList[this.id];
    continentClickedLatLong = new google.maps.LatLng(continentClicked.lat, continentClicked.lng);

    map.setZoom(continentClicked.zoom);
    map.setCenter(continentClickedLatLong);
  });
}

google.maps.event.addDomListener(window, 'load', function(){initialize();});



