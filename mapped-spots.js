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
  // tableid: "1Ay8W3xm9KDz-gbyoWe9Gcax-lUe_hEkDgOtiSdYW",
  tableid: "1wyZt40op_meNqhbXRau8POam0GzvWa3MKmUHR9KC",
  querySelection: "lat",
  icon: "schools"
};

// Initial options set for map
var initialMapOptions = {
  center: new google.maps.LatLng(continentList.nZed.lat, continentList.nZed.lng),
  zoom: continentList.nZed.zoom,
  zoomControl: true
};

// Initialize map
function initialize() {
  var styledMap = new google.maps.StyledMapType(moonriseKingdomStyles);
  var map = new google.maps.Map(document.getElementById("map-canvas-div"), initialMapOptions);

  // Create the search box and link it to the UI element.
  var input = document.getElementById('location-search-box');
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  var searchBox = new google.maps.places.SearchBox(input);

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
    map: map,
    options: {
      templateId: 3
    }
  });

  // Geolocation upon navbar div click - in case someone wants to go to their current location and browse nearby
  $('.current-location').on('click', function() {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( function(position) {
        userLatLong = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        userZoom = 8;
        initialMarker = new google.maps.Marker({
          position: userLatLong,
          map: map,
          icon: 'http://www.google.com/mapfiles/ms/micons/orange.png',
          title: "You're here",
        });
        map.setCenter(userLatLong);
        map.setZoom(userZoom);
      });
    }
  });

  // Geolocation - the centering when someone clicks on a specific continent from the DOM dropdown
  $(".specific-continent").on('click', function() {
    var continentClicked = continentList[this.id];
    continentClickedLatLong = new google.maps.LatLng(continentClicked.lat, continentClicked.lng);

    map.setZoom(continentClicked.zoom);
    map.setCenter(continentClickedLatLong);
  });

  // Listen for the event fired when the user selects an item from the
  // pick list. Retrieve the matching places for that item.
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length === 0) {
      return;
    }

    var bounds = new google.maps.LatLngBounds();

    for (var i = 0, place; place = places[i]; i++) {
      bounds.extend(place.geometry.location);
    }

    map.fitBounds(bounds);
    map.setZoom(8);
  });

}

google.maps.event.addDomListener(window, 'load', function(){initialize();});



