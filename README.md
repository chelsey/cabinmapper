# cabinmapper

> Find your daydreamy cabin somewhere along the road less traveled by

### Project Description

This web app collects all cabins found on cabinporn.com, writes the cabins' locations and information to a file, geocodes each cabin on a map, and displays each cabin as a marker on the map with its information in an infowindow on the map.

Live app can be found at: http://cabinmapper.herokuapp.com/

### Scraping & Geolocating

Each cabin and its information needs to be written to a `.tsv` file. One piece of information for each cabin is location. The location needs to be geocoded (via the Google Geocoding API) to return a latitude/longitude for plotting the cabin on a map.

Both steps can be done via running the command `python main.py` from within the `./scripts` directory

###

https://www.google.com/fusiontables/DataSource?docid=1BJaVBt_U-glmimNfFzkMFYX57X3ipS3oNFH0oq5e
