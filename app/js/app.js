// Initialize map
// @param continent [String] The continent used as default
var initialize = function initialize (continent) {
  var styledMap = new google.maps.StyledMapType(initialSetup.styling),
      map = new google.maps.Map(document.getElementById('map-canvas-div'), initialView(continent)),

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
  // Centers map on user's current location
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
        cookie.create('userLat', userLat, 200);
        cookie.create('userLng', userLng, 200);
      });
    }
  });

  // Geolocation on click from DOM dropdown
  // Centers map on a specific continent selected by user
  $('.js-specific-continent').on('click', function () {
    var continentClicked = continents[this.id];

    map.setCenter(new google.maps.LatLng(continentClicked.lat, continentClicked.lng));
    map.setZoom(continentClicked.zoom);
  });

  // Event listener on searchBox when text entered.
  // Retrieves the matching places for that item.
  // Fits map to new bounds & sets zoom.
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
  initialize('nZed');
});