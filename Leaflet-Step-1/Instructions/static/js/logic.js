// This assignemnt is using United States Geological Survey (USGS) 
// non-visualized data to make a meaningful and visualized data resources, 
// so that the data can be well used by educating public and 
// supporting government organizations on issues facing our planet. 

// Get data set
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(earthquakeURL, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
});

  // Define a function we want to run once for each feature in the features array
  function createFeatures(earthquakeData) {
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    var earthquakes = L.geoJSON(earthquakeData, {
      // Give each feature a popup describing the earthquake place, lat, long, and magnitude
      onEachFeature: function(feature, layer) {
        layer.bindPopup(`<h4> ${feature.properties.place} <hr> 
        Latitude: ${feature.geometry.coordinates[1]} </h4> </n> 
        <h4> Longitude: ${feature.geometry.coordinates[0]} </h4> <hr> 
        <h4> Magnitude: ${feature.properties.mag} </h4>`);
      },
      // Use pointToLayer function to create circle markers
      pointToLayer: function(feature, coordinates) {
        return new L.circle(coordinates,
          {radius: markerSize(feature.properties.mag),
          fillColor: markerColor(feature.properties.mag),
          fillOpacity: 0.65,
          color: "grey",
          stroke: true,
          weight: 0.8
        })
      }
    });
    // Sending earthquakes layer to the createMap function
    createMap(earthquakes);
  }
  
  // function to receive a layer of markers and plot them on a map.
  function createMap(earthquakes) {
  
    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
  }).addTo(myMap);

  // Set up a legend
  var legend = L.control({ position: 'bottomright' });
    
    legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend');
    
    labels = [];
    magnitudes = [0, 1, 2, 3, 4, 5];

    // loop through earthquake grade and generate a label with gradient color for each grade
    for (var i = 0; i < magnitudes.length; i++){
        
      labels.push(`<li style = "background-color:`+ markerColor(magnitudes[i]+1)+`"></li>`
      + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : ' + '));
    }
    
    div.innerHTML += '<h5>Magnitude</h5>' +
    '<div class="labels"></div>' + '<ul>' + labels.join('') + '</ul>';
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
}

// Enlarge earthquake magnitude number of pixels for displaying the marker on the map
function markerSize(mag) {
    return mag * 25000;
  }
  
// Create marker color for earthquake magnitudes 
function markerColor(mag) {
  if (mag <= 1) {
    return "lightgreen";
  } else if (mag <= 2) {
    return "yellowgreen";
  } else if (mag <= 3) {
    return "yellow";
  } else if (mag <= 4) {
    return "orange";
  } else if (mag <= 5) {
    return "orangered";
  } else {
    return "red";
  };
}
