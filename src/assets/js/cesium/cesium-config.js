var MISSION_ID;
var MISSION_HAS_NAME;
var MISSION_ALLOW_EDIT;
var MISSIONS_URL;

function initMissionMapData(mission, mode) {
  MISSION_ID = mission.id || 'new';
  MISSION_HAS_NAME = Boolean(mission.name);
  MISSION_ALLOW_EDIT = mode !== 'view';
  MISSIONS_URL = '/missions';

  $('#mission-data').text(JSON.stringify(mission.mission));

  CesiumJS();
  // CesiumPublicJS();
  // initCesiumData();
}

var geocoder;

function initMap() {
  geocoder = new google.maps.Geocoder();
}

function gmap_getLocations(pos) {
  return new Promise(function (resolve, reject) {
    if (geocoder) {
      geocoder.geocode({'location': pos},
        function (results, status) {
          if (results && results.length > 0) {
            var fullName = results[0].formatted_address
            var firstComponent = results[0].address_components[0].short_name

            resolve({fullName, firstComponent})
          }
        });
    }
  })
}

function airmap_getWeather(pos) {
  return $.ajax({
    url: "https://api.airmap.com/advisory/v1/weather?latitude=" + pos.lat + "&longitude=" + pos.lng,
    headers: {"X-API-Key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVkZW50aWFsX2lkIjoiY3JlZGVudGlhbHxKd0xaSkpaUzllZGFweHVYUVpEbkV0a2JRYjZiIiwiYXBwbGljYXRpb25faWQiOiJhcHBsaWNhdGlvbnxLbGxxcUs3VER6a3k4bUhua2JNd3ZGcTRueEd6Iiwib3JnYW5pemF0aW9uX2lkIjoiZGV2ZWxvcGVyfFJablkzYnFjeUo5WEFrQ0JBeHFObXRNWXFuZDQiLCJpYXQiOjE1MTc1OTE2OTV9.c0zvqM4uKuES4NKFv8QrnDV4KAf5xbphoBlen_4ikhk"}
  });
}
