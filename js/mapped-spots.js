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
    styling: moonriseKingdomStyles
  },

  // Options for the initial center & zoom for the map
  // @param lat [Object] The latitude of initial map's center location
  // @param long [Object] The longitude of initial map's center location
  // @param zoom [Object] The map zoom of initial map
  initialMapOptions = function (lat, lng, zoom) {
    return {
      center: new google.maps.LatLng(lat, lng),
      zoom: zoom,
      zoomControl: true
    };
  },

  // Options for the initial center & zoom for the map
  createCookie = function (name,value,days) {
    var expires = '',
        date = new Date();

    if (days) {
      date.setTime(date.getTime()+(days*24*60*60*1000));
      expires = '; expires='+date.toGMTString();
    }

    document.cookie = name+'='+value+expires+''+'; path=/';
  },

  readCookie = function (name) {
    var nameEqual = name + '=',
        cArray = document.cookie.split(';'),
        i = 0,
        cArrayLeng = cArray.length,
        cookieName = '';

    for (i; i < cArrayLeng; i++) {
      cookieName = cArray[i];

      while (cookieName.charAt(0) === ' ') {
        cookieName = cookieName.substring(1, cookieName.length);
      }

      if (cookieName.indexOf(nameEqual) === 0) {
        return cookieName.substring(nameEqual.length, cookieName.length);
      }
    }
    return null;
  },

// Initialize map
// @param [Object] hash key The key of a continent
  initialize = function initialize(lat, lng, zoom) {
    var userCookieLat = readCookie('userLat'),
        userCookieLng = readCookie('userLng'),
        mapOnLoad;

    if (userCookieLat) {
      mapOnLoad = initialMapOptions(userCookieLat, userCookieLng, 8);
    }
    else {
      mapOnLoad = initialMapOptions(lat, lng, zoom);
    }

    var styledMap = new google.maps.StyledMapType(initialSetup.styling),
        map = new google.maps.Map(document.getElementById('map-canvas-div'), mapOnLoad),

        // Create the search box and link it to the UI element.
        input = document.getElementById('location-search-box'),
        searchBox = new google.maps.places.SearchBox(input);

        // Select our data points using SQL-like syntax courtesy of the Google API
    var layer = new google.maps.FusionTablesLayer({
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
};

google.maps.event.addDomListener(window, 'load', function () {
  initialize(continentList.nZed.lat, continentList.nZed.lng, continentList.nZed.zoom);
});