// Continent list hash of hashes
var continentList = {
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
    styling: moonriseKingdomStyles,
  };

// Options for the initial center & zoom for the map
// @param [Object] hash key The key of a continent
var defaultMapOptions = function (continent) {
  return {
    center: new google.maps.LatLng(continent.lat, continent.lng),
    zoom: continent.zoom,
    zoomControl: true
  };
};

function createCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = '; expires='+date.toGMTString();
  }
  else var expires = '';
  document.cookie = name+'='+value+expires+''+'; path=/';
}

function readCookie(name) {
  var nameEqual = name + '=',
      cArray = document.cookie.split(';'),
      i = 0,
      cArrayLeng = cArray.length;
  for (i; i < cArrayLeng; i++) {
    var c = cArray[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEqual) == 0) return c.substring(nameEqual.length, c.length);
  }
  return null;
}

var userCookieLat = readCookie('userLat'),
    userCookieLng = readCookie('userLng');

var cookieMapOptions = function (lat, lng) {
  return {
    center: new google.maps.LatLng(lat, lng),
    zoom: 8,
    zoomControl: true
  };
};

// Initialize map
// @param [Object] hash key The key of a continent
function initialize(continent) {

  if(userCookieLat) {
    var map = new google.maps.Map(document.getElementById('map-canvas-div'), cookieMapOptions(userCookieLat, userCookieLng));
        initialMarker = new google.maps.Marker({
        position: (new google.maps.LatLng(userCookieLat, userCookieLng)),
        map: map,
        icon: 'http://www.google.com/mapfiles/ms/micons/orange.png',
        title: 'Your location'
      });
  }
  else
    var map = new google.maps.Map(document.getElementById('map-canvas-div'), defaultMapOptions(continent));

  var styledMap = new google.maps.StyledMapType(initialSetup.styling),
      //defaultMapOptions(continent)

      // Create the search box and link it to the UI element.
      input = document.getElementById('location-search-box'),
      searchBox = new google.maps.places.SearchBox(input),

      // Select our data points using SQL-like syntax courtesy of the Google API
      layer = new google.maps.FusionTablesLayer({
        query: {
          select: initialSetup.querySelection,
          from: initialSetup.tableId
        },
        styles: [{
          markerOptions: {
            iconName: initialSetup.icon
          }
        }],
        map: map,
        options: {
          templateId: 3
        }
      });

  // Associate the styled map with the MapTypeId and set it to display.
  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Geolocation on click from DOM navbar div click
  // Centers map on user's current location to browse nearby
  $('.js-current-location').on('click', function () {
    if (navigator.geolocation) {
      // Geolocation supported
      navigator.geolocation.getCurrentPosition( function (position) {
        var userLat = position.coords.latitude,
            userLng = position.coords.longitude,
            userLatLng = new google.maps.LatLng(userLat, userLng),
            userZoom = 8,
            initialMarker = new google.maps.Marker({
              position: userLatLng,
              map: map,
              icon: 'http://www.google.com/mapfiles/ms/micons/orange.png',
              title: 'Your location'
            });

        // Set the current map's center & zoom to the user's lat, lng, zoom
        map.setCenter(userLatLng);
        map.setZoom(userZoom);

        // Create cookie for user's lat & long
        createCookie('userLat', userLat, 100);
        createCookie('userLng', userLng, 100);
      });

    }
  });

  // Geolocation on click from DOM dropdown
  // Centers map on a specific continent
  $('.js-specific-continent').on('click', function () {
    var continentClicked = continentList[this.id];

    map.setCenter(new google.maps.LatLng(continentClicked.lat, continentClicked.lng));
    map.setZoom(continentClicked.zoom);
  });

  // Event listener on searchBox when the user selects item from pick list.
  // Retrieve the matching places for that item.
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