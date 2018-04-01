/* ================================
Styling each page
================================ */
var state = {
  "slideNumber": 0,
  "slideData": [
    {
      "title": "Bike share stations in Philadelphia",
      "content": "Cities across the nation are abuzz with bike share programs. It turns out bike share programs with good quality could have a huge positive impact on cities. This project is to explore the bike share system in Philadelphia. First, lets look at the locations of existing Indego stations and their trip count. As shown in the map, stations were build around the center city, and it is obvious that the closer to the center city, the more trips depart from stations. You can click on any of the stations to get more related information. Besides, you may use the toolbox below to filter them by trip count:"
    },
    {
      "title": "Does the system close to subway stations?",
      "content": "Bike sharing can play a role in providing access to transit stations and then to final destinations, and people commute by transit could be bikeshare target users too. Therefore, planning a walking distance between transit stations and bike share will improve the efficiency for both of the two systems. As we could see in the map, although several Indego stations were built really close to Septa staion which exactly increased their trip count, more than 50% of the Indego stations are still farther than 1000m apart from their nearest transit stations."
    },
    {
      "title": "Does the system benefit low income communities?",
      "content": "In order to induce more sustainable mode choices in the future, a successful bike share system should have the policy goal to locate the stations into low income neighborhoods where bike share demand may not be profitable but might benefit more vulnerable people. However, according to the map, there are more stations built in medium-high income areas, without an emphasis on low income neighborhoods."
    },
    {
      "title": "Does the system meet residents' need?",
      "content": "Bike sharing programs can benefit cyclist in bicycle commuting by providing convenient, fun, safe, and secure bikes. A bike share system could be more useful and efficiently if built in the area with a higher percent of people commute by bike. We could see in the map that more stations do fall in census tracts with more people who prefer to commute by bike."
    },
    {
      "title": "Find Station Around You",
      "content": "Finally, if you are living in Philadephia and would like to have a bikeshare experience, go find the nearest station around you! (Please input your longitude and latitude and press SEARCH. Remember to press RESET if you want to change the location.)"
    }
  ]
};

var legend = [$('#legend1'),$('#legend2'),$('#legend3'),$('#legend4'), $('#legend5')];


/* ===============================
zoom function
==============================*/
var zoomLayer = function(){
  if (state.slideNumber === 0){
    map.setView([39.953400, -75.21266], 13);
  }
  if (state.slideNumber === 1){
    map.setView([39.953400, -75.18266], 14);
  }
  else if (state.slideNumber === 2){
    map.setView([39.953400, -75.21266], 13);
  }
  else if (state.slideNumber === 3){
    map.setView([39.953400, -75.21266], 13);
  }
  else if (state.slideNumber === 4){
    map.setView([39.953400, -75.21266], 13);
  }
};


/* ===============================
style functions
==============================*/
// Styles for bike share stations
function TripCountColor(d) {
    return d > 10000  ? '#E31A1C' :
           d > 8000  ? '#FC4E2A' :
           d > 6000   ? '#FD8D3C' :
           d > 4000   ? '#FEB24C' :
           d > 2000   ? '#FED976' :
                      '#FFEDA0';
}
function TripCountRadius(d) {
    return d > 10000  ? 10 :
           d > 8000  ? 8 :
           d > 6000   ? 6 :
           d > 4000   ? 5 :
           d > 2000   ? 4 :
                      3;
}
function DistSubwayColor(d) {
    return d > 3000  ? '#ffffcc':
           d > 2000  ? '#c7e9b4' :
           d > 1500   ? '#7fcdbb' :
           d > 1000   ? '#41b6c4' :
           d > 750   ? '#2c7fb8' :
                      '#253494';
}

function DistSubwaySize(d) {
    return d > 3000  ? 3:
           d > 2000  ? 4 :
           d > 1500   ? 5 :
           d > 1000   ? 6 :
           d > 750   ? 8 :
                      10;
}

function StyleTripCount(feature) {
    return {
    radius: TripCountRadius(feature.properties["Trip Count"]),
    fillColor:TripCountColor(feature.properties["Trip Count"]),
    color: "#828A8F",
    weight: 1,
    opacity: 0.7,
    fillOpacity: 0.8
  };
}
function StyleOnlyPoint(feature) {
    return {
    radius: 5,
    fillColor:"white",
    color: "#828A8F",
    weight: 2,
    opacity: 0.9,
    fillOpacity: 0.5
  };
}
function StyleDistSepta(feature) {
    return {
    radius:DistSubwaySize(feature.properties["Distance to Septa"]),
    fillColor:DistSubwayColor(feature.properties["Distance to Septa"]),
    color: "#828A8F",
    weight: 1,
    opacity: 0.7,
    fillOpacity: 0.9
  };
}

// Styles for census tracts
// set color for different layer
function IncomeColor(d) {
    return d > 80000  ? '#E31A1C' :
           d > 55000  ? '#FC4E2A' :
           d > 40000   ? '#FD8D3C' :
           d > 25000   ? '#FEB24C' :
           d > 10000   ? '#FED976' :
                      '#FFEDA0';
}

function CommuteColor(d) {
    return d > 5  ? '#7a0177' :
           d > 4  ? '#c51b8a' :
           d > 3   ? '#f768a1':
           d > 2   ? '#fa9fb5':
           d > 1   ? '#fcc5c0' :
                      '#feebe2';
}
// stylish
function styleNone(feature) {
    return {
        fillColor: "transparent",
        weight: 1,
        opacity: 0.5,
        color: 'grey',
        dashArray: '2',
        fillOpacity: 0.7
    };
}
function styleIncome(feature) {
    return {
        fillColor: IncomeColor(feature.properties.Income),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}
function styleCommute(feature) {
    return {
        fillColor: CommuteColor(feature.properties["Commute by Bike"]),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}



/* ===============================
Popup function
==============================*/
var Popup = function(parsedBike) {
  var pop =
  "<table><tr><th>Station Name:</th><td>"+ parsedBike.properties["Station Name"] + "</td></tr></table>"+
  "<table><tr><th>Trip Count:</th><td>"+ parsedBike.properties["Trip Count"] + "</td></tr></table>"+
  "<table><tr><th>Number of Docks:</th><td>"+ parsedBike.properties["Number of Docks"]+ "</td></tr></table>"+
  "<table><tr><th>Lon:</th><td>"+ parsedBike.properties.lon + "</td></tr></table>"+
  "<table><tr><th>Lat:</th><td>"+ parsedBike.properties.lat + "</td></tr></table>"+
  "<table><tr><th>Go Live Date:</th><td>"+ parsedBike.properties['Go Live Date'] + "</td></tr></table>";
  return pop;
};

/* ===============================
Icon function
==============================*/
var myIcon = L.icon({
    iconUrl: 'markerbike.png',
    iconSize: [40, 40],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    shadowUrl: 'marker-shadow.png',
    shadowSize: [70, 40],
    shadowAnchor: [23, 95]
});
