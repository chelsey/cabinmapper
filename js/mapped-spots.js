// Continent List
var continentList = {
  "africa": { lat: -16, lng: 25, zoom: 4 },
  "nAmerica": { lat: 40, lng: -104, zoom: 5 },
  "sAmerica": { lat: -30, lng: -65, zoom: 4 },
  "europe": { lat: 46, lng: 6, zoom: 5 },
  "australia": { lat: -32, lng: 140, zoom: 4 },
  "asia": { lat: 33, lng: 120, zoom: 5 },
  "antartica": { lat: -75, lng: -65, zoom: 3 },
  "nZed": { lat: -43.595, lng: 170.1416666, zoom: 7 }
};

var initialSetup = function (continent, markerIcon, mapStyles) {
  // Setup for the Fusion Table
  var tableId = "1wyZt40op_meNqhbXRau8POam0GzvWa3MKmUHR9KC",
      querySelection = "lat",
      icon = markerIcon || "schools",

    // Google Maps initial load options
      initialMapOptions = {
        center: new google.maps.LatLng(continent.lat, continent.lng),
        zoom: continent.zoom,
        zoomControl: true
      },

      styling = mapStyles || moonriseKingdomStyles;

  return {
    tableId: tableId,
    querySelection: querySelection,
    icon: icon,
    initialMapOptions: initialMapOptions,
    styling: styling
  };
};

// Initialize map
function initialize(continent, markerIcon, mapStyles) {
  var styledMap = new google.maps.StyledMapType(initialSetup(continent).styling),
      map = new google.maps.Map(document.getElementById("map-canvas-div"), initialSetup(continent).initialMapOptions),

      // Create the search box and link it to the UI element.
      input = document.getElementById('location-search-box'),
      searchBox = new google.maps.places.SearchBox(input),

      // Select our data points using SQL-like syntax courtesy of the Google FT API
      layer = new google.maps.FusionTablesLayer({
        query: {
          select: initialSetup(continent).querySelection,
          from: initialSetup(continent).tableId
        },
        styles: [{
          markerOptions: {
            iconName: initialSetup(continent, markerIcon).icon
          }
        }],
        map: map,
        options: {
          templateId: 3
        }
      });

  // Associate the styled map with the MapTypeId and set it to display.
  map.mapTypes.set("map_style", styledMap);
  map.setMapTypeId("map_style");

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Geolocation upon navbar div click - in case someone wants to go to their current location and browse nearby
  $('.js-current-location').on('click', function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( function (position) {

        var userLatLong = new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
            userZoom = 8,
            initialMarker = new google.maps.Marker({
              position: userLatLong,
              map: map,
              icon: 'http://www.google.com/mapfiles/ms/micons/orange.png',
              title: "Your location"
            });

        map.setCenter(userLatLong);
        map.setZoom(userZoom);
      });
    }
  });

  // Geolocation - the centering when someone clicks on a specific continent from the DOM dropdown
  $(".js-specific-continent").on('click', function () {
    var continentClicked = continentList[this.id];

    map.setCenter(new google.maps.LatLng(continentClicked.lat, continentClicked.lng));
    map.setZoom(continentClicked.zoom);
  });

  // Listen for the event fired when the user selects an item from the
  // pick list. Retrieve the matching places for that item.
  google.maps.event.addListener(searchBox, 'places_changed', function () {
    var places = searchBox.getPlaces(),
        bounds = new google.maps.LatLngBounds(),
        i = 0,
        place;

    if (places.length === 0) {
      return;
    }

    for (i; place = places[i]; i++) {
      bounds.extend(place.geometry.location);
    }

    map.fitBounds(bounds);
    map.setZoom(8);
  });
}

google.maps.event.addDomListener(window, 'load', function(){ initialize(continentList.nZed);} );