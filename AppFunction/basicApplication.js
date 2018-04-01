/* ================================
Midterm Project
================================ */
/* =====================
 Input Leaflet Map
===================== */
var map = L.map('map', {
  center: [39.953400, -75.21266],
  zoom: 13,
});
var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);


/* ===============================
Input data
==============================*/
var bikedata = 'https://raw.githubusercontent.com/DaisyXu77/OST4GIS-Midterm/master/PhillyBikeShare.geojson';
var phillycensus = 'https://raw.githubusercontent.com/DaisyXu77/OST4GIS-Midterm/master/PhillyCensus.geojson';

$.ajax(bikedata).done(function(data){
  var parsedBike = JSON.parse(data);
  makePoints(parsedBike);});

/* ===============================
Functions
==============================*/
// make and store bike share points and census tracts layers
var makePoints=function(parsedBike){
  BikePoint1 = L.geoJson(parsedBike, {
    style:StyleTripCount,
    pointToLayer: function (point,style) {
      return L.circleMarker([point.geometry.coordinates[1],point.geometry.coordinates[0]], style).bindPopup(Popup(point)).closePopup();
    }
  });
  BikePoint2 = L.geoJson(parsedBike, {
    style: StyleDistSepta,
    pointToLayer: function (point,style) {
      return L.circleMarker([point.geometry.coordinates[1],point.geometry.coordinates[0]], style).bindPopup(Popup(point)).closePopup();
    }
  });
  BikePoint3 = L.geoJson(parsedBike, {
    style:StyleOnlyPoint,
    pointToLayer: function (point,style) {
      return L.circleMarker([point.geometry.coordinates[1],point.geometry.coordinates[0]], style).bindPopup(Popup(point)).closePopup();
    }
  });
  BikePoint4 = L.geoJson(parsedBike, {
    style:StyleOnlyPoint,
    pointToLayer: function (point,style) {
      return L.circleMarker([point.geometry.coordinates[1],point.geometry.coordinates[0]], style).bindPopup(Popup(point)).closePopup();
    }
  });
  BikePoint5 = L.geoJson(parsedBike, {
    style:StyleOnlyPoint,
    pointToLayer: function (point,style) {
      return L.circleMarker([point.geometry.coordinates[1],point.geometry.coordinates[0]], style).bindPopup(Popup(point)).closePopup();
    }
  });
  BikePoints=[BikePoint1,BikePoint2,BikePoint3,BikePoint4,BikePoint5];
};


var makeCensus=function(parsedCensus){
  CensusTracts1 = L.geoJson(parsedCensus, {style:styleNone});
  CensusTracts2 = L.geoJson(parsedCensus, {style:styleNone});
  CensusTracts3 = L.geoJson(parsedCensus, {style:styleIncome});
  CensusTracts4 = L.geoJson(parsedCensus, {style:styleCommute});
  CensusTracts5 = L.geoJson(parsedCensus, {style:styleNone});
  CensusTracts=[CensusTracts1,CensusTracts2,CensusTracts3,CensusTracts4,CensusTracts5];
};

// add or remove a layer
var addNewLayer=function(){
  CensusTracts[state.slideNumber].addTo(map);
  BikePoints[state.slideNumber].addTo(map);
  //add lenged
  legend[state.slideNumber].show();
  //add description
  var pageInfo = [
    $(".subtitle").text(state.slideData[state.slideNumber].title),
    $(".description").text(state.slideData[state.slideNumber].content)
  ];
  return (pageInfo);
};

var removePreLayer=function(){
  map.removeLayer(BikePoints[state.slideNumber]);
  map.removeLayer(CensusTracts[state.slideNumber]);
  legend[state.slideNumber].hide();
};

//click buttons
var clickNextButton = function() {
  state.slideNumber += 1;
  if (state.slideNumber < state.slideData.length-1){
    $("#previous").show();
    $("#next").show();
    addNewLayer();
  } else{
    $("#previous").show();
    $("#next").hide();
    addNewLayer();
    lastPage();
  }
};

var clickPreviousButton = function() {
  state.slideNumber -=1;
  if (state.slideNumber > 0){
    $("#previous").show();
    $("#next").show();
    addNewLayer();
  } else{
    $("#previous").hide();
    $("#next").show();
    $("#slidecontainer").show();
    firstPage();
  }
};

//slider for first page
//reference:https://www.w3schools.com/howto/howto_js_rangeslider.asp
var sliderFilter=function(){
  var slider = document.getElementById('myRange');
  var output = document.getElementById("outputRange");
  output.innerHTML = slider.value;
  slider.oninput = function() {
    output.innerHTML = this.value;
  };
  BikePoint1.addTo(map);
  slider.addEventListener('input', function(e) {
    rangeMax = document.getElementById('myRange').value;
    map.removeLayer(BikePoint1);
    BikePoint1 = L.geoJson(parsedBike, {
      filter:
          function(feature, layer) {
               return (feature.properties["Trip Count"] <= rangeMax) ;
          },
      style:StyleTripCount,
      pointToLayer: function (point,style) {
        return L.circleMarker([point.geometry.coordinates[1],point.geometry.coordinates[0]], style).bindPopup(Popup(point)).closePopup();
      }
    });
    BikePoint1.addTo(map);
  });
};

// Plot Nearest Station for Page 5 using leafletKnn
var plotNearest = function(feature){
  nearest = leafletKnn(feature).nearest(L.latLng($('#lat').val(),$('#lon').val()), 1);
  nearestmarkers = [];
  _.each(nearest,function(obj){
    nearestmarkers.push(L.marker([obj.lat,obj.lon],{icon: myIcon}));
  });
  addNear=_.each(nearestmarkers,function(markers){markers.addTo(map);});
  return addNear;
};

// set initial page(filter by trip count)
var firstPage=function(){
  $("#previous").hide();
  $("#next").show();
  legend[0].show();
  $(".subtitle").text(state.slideData[0].title);
  $(".description").text(state.slideData[0].content);
  $("#slidecontainer").show();
  $("#next").click(function(){
    $("#slidecontainer").hide();
    map.removeLayer(BikePoint1);
  });
  CensusTracts1.addTo(map);
  sliderFilter();
  map.setView([39.953400, -75.21266], 13);
};

// set last page(find the clothest station)
var lastPage=function(){
  NearLayers=[];
  $(".CoordinateBox").show();
  $('#lat').val(39.95);
  $('#lon').val(-75.16);
  $('#lat').prop('disabled',false);
  $('#lon').prop('disabled',false);
  $('#button2').click(function(){
    plotNearest(BikePoint5);
    map.setView([$('#lat').val(),$('#lon').val()], 15);
    NearLayers.push(addNear);
  });
  //user might input many points, the following funtions are to remove all points
  $("#previous").click(function(){
    _.each(NearLayers,function(obj){
      map.removeLayer(obj[0]);
    });
    $(".CoordinateBox").hide();
  });
  $("#resetbutton").click(function(){
    _.each(NearLayers,function(obj){
      map.removeLayer(obj[0]);
      map.setView([39.953400, -75.21266], 13);
    });
  });
};

//Set default
var setProp=function(){
  firstPage();
  zoomLayer();
  $("#previous").hide();
  $("#next").show();
};


/* ===============================
Execution !
==============================*/

$(document).ready(function() {
  $.ajax(phillycensus).done(function(data) {
    parsedCensus = JSON.parse(data);
    makeCensus(parsedCensus);
      $.ajax(bikedata).done(function(data){
        parsedBike = JSON.parse(data);
        makePoints(parsedBike);
        setProp();
    });
  });
});


$("#previous").click(function(){
  removePreLayer();
  clickPreviousButton();
  zoomLayer();
});

$("#next").click(function(){
  removePreLayer();
  clickNextButton();
  zoomLayer();
});
