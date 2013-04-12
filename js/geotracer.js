var locationTimer;

/**
if (Modernizr.geolocation) { 
        navigator.geolocation.getCurrentPosition(alert('OK'), alert('NOK'));
    } else {
        alert('no geolocation');
    }
 **/

function TrackingPoint(time, lati, longi, status) {
    this.timestamp = new Date().getTime();
    this.latitude = lati;
    this.longitude = longi;
    this.statusCode = status;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

/** found: http://stackoverflow.com/questions/27928/how-do-i-calculate-distance-between-two-latitude-longitude-points **/
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function getCurrentStorageSequence() {
    var currentSequenceId = localStorage.getItem("currentSequenceId");
    if (currentSequenceId || !isNaN(currentSequenceId)) {
        return (currentSequenceId * 1); // convert to number
    }
    return 0;
}

function calculateDistance(point1, point2) {
    return getDistanceFromLatLonInKm(point1.latitude, point1.longitude, point2.latitude, point2.longitude);
}


function calculateTotalDistance() {
    var lastIndex = getCurrentStorageSequence();
    var totaldistance = 0;
    var previousPosition = null;
    for (var i = 1; i <= lastIndex; ++i) {
        if(!previousPosition) {
            previousPosition = getPositionFromLocalStorage(i-1);
        }
        currentPosition = getPositionFromLocalStorage(i);
        if (previousPosition) {
            totaldistance = totaldistance + calculateDistance(currentPosition, previousPosition);
        }
        previousPosition = currentPosition;
    }
    return totaldistance;
}

function calculateElapsedTime(trackingPoint1, trackingPoint2) {
    if (trackingPoint1 && trackingPoint2) {
        return trackingPoint2.timestamp - trackingPoint1.timestamp;
    }
    return 0;
}


function calculateSpeed(distance, elapsedTimeMillies) {
    if (distance == null || elapsedTimeMillies == null
            || isNaN(distance) || isNaN(elapsedTimeMillies) )
        return 0;
    
    if (elapsedTimeMillies == 0)
        return 0;
    
    return distance/(elapsedTimeMillies/1000/60/60);
}

function storePosition(id, trackingPoint) {
    var positionJson = JSON.stringify(trackingPoint);
    localStorage.setItem(id + ":trackingPoint", positionJson);
}

function getPositionFromLocalStorage(id) {
    var positionJson = localStorage.getItem(id + ':trackingPoint');
    if (positionJson) {
        return JSON.parse(positionJson);
    }
    return null;
}

function storeAndShowCurrentPosition(position) {
    var previousPosition = getPositionFromLocalStorage(getCurrentStorageSequence());
    var trackingPoint = new TrackingPoint(new Date().getTime(), position.coords.latitude, position.coords.longitude, '');

    // only store position if the distance to the previous one is > 10m or there are no samples available yet        
    if (!previousPosition || calculateDistance(trackingPoint, previousPosition) > 0.01) {
        var storageId = getNewSequenceId();
        storePosition(storageId, trackingPoint);
        appendTrackingPointToTable(trackingPoint)
        calculateAndPaintSpeedAndDistance();
    }
    
    // set new timer for next checkpoint
    locationTimer = window.setTimeout("determineCurrentPosition()", 5000);
} 

function showTrip(trackingPointList) {
    resetDisplay();
    
    for (var i=0; i<trackingPointList.length; i++) {
        appendTrackingPointToTable(trackingPointList[i]);
    }
    calculateAndPaintSpeedAndDistance();
    drawGoogleMapCenteredToLastPosition();
}

function showCurrentTrip() {
    var lastIndex = getCurrentStorageSequence();
    var trackingPointList = [];
    for (var i = 1; i <= lastIndex; ++i) {
        trackingPointList.push(getPositionFromLocalStorage(i));
    }
    showTrip(trackingPointList);
}


function appendTrackingPointToTable(trackingPoint) {
    $('#collectedData').append('<tr><td>' + trackingPoint.timestamp + '</td><td>' + trackingPoint.latitude + '</td><td>' + trackingPoint.longitude + '</td></tr>');
}

function calculateAndPaintSpeedAndDistance() {
    var totalDistance = calculateTotalDistance();
    
    trackingPoint1 = getPositionFromLocalStorage(1);
    trackingPoint2 = getLastPosition();
    
    var speed = calculateSpeed(totalDistance, calculateElapsedTime(trackingPoint1, trackingPoint2));
    $('#totaldistance').html('total distance: ' + totalDistance.toFixed(2) + ' km');
    $('#speed').html('Speed: ' + speed.toFixed(2) + ' km/h');
}


function errorRetrievingCurrentPosition(error) {
    // local storage of error message
    var storageId = getNewSequenceId();

    var trackingPoint = new TrackingPoint(new Date().getTime(), null, null, error);
    storePosition(storageId, trackingPoint);

    // set new timer for next checkpoint
    locationTimer = window.setTimeout("determineCurrentPosition()", 10000);
}

function Trip(tripName, trackingPointList) {
    this.trackingPoints = trackingPointList;
    this.name = tripName;
}

function getLastPosition() {
    currentSequenceId = getCurrentStorageSequence();
    var lastPosition = getPositionFromLocalStorage(currentSequenceId);
    return lastPosition;
}



function getNewSequenceId() {
    var increasedSequenceId = parseInt(getCurrentStorageSequence())+1;
    localStorage.setItem("currentSequenceId",  increasedSequenceId);
    return increasedSequenceId;
}


function drawGoogleMapCenteredToLastPosition() {
    lastPosition = getLastPosition();
    if (lastPosition != null) {
        drawGoogleMap(lastPosition.latitude, lastPosition.longitude);
    }
}


function drawGoogleMap(latitude, longitude) {
    var mapOptions = {
            center: new google.maps.LatLng(latitude, longitude),
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    
    var myPathCoordinates = [];
    var lastIndex = getCurrentStorageSequence();
    
    for (var i = 1; i <= lastIndex; ++i) {
        currentPosition = getPositionFromLocalStorage(i);
        myPathCoordinates.push(new google.maps.LatLng(currentPosition.latitude, currentPosition.longitude));
    }
    
   var myPath = new google.maps.Polyline({
     path: myPathCoordinates,
     strokeColor: "#FF0000",
     strokeOpacity: 1.0,
     strokeWeight: 2
   });
   
   myPath.setMap(map);
}


function stopTracing() {
    window.clearTimeout(locationTimer);
    var trackingPoint = getLastPosition();
    drawGoogleMap(trackingPoint.latitude, trackingPoint.longitude);
}

function startTracing() {
    showTripDataSection();
    showCurrentTrip();
    navigator.geolocation.getCurrentPosition(storeAndShowCurrentPosition,errorRetrievingCurrentPosition);
}

function resetAll() {
    localStorage.clear();
    resetDisplay();
}

function resetDisplay() {
    $('#collectedData').find("tr:gt(0)").remove();
    $('#totaldistance').html('total distance: 0 km');
    $('#map-canvas').html('');
    $('#speed').html('Speed: 0 km/h');
}



function saveTrip() {
    
    var trackingPointList = [];
    var lastIndex = getCurrentStorageSequence();
    
    for (var i = 1; i <= lastIndex; ++i) {
        currentPosition = getPositionFromLocalStorage(i);
        trackingPointList.push(currentPosition);
    }
    
    if (trackingPointList.length > 0) {
        var name = prompt("please enter the name of the trip");
        
        if (name != null && name!='') {
            var trip = new Trip(name, trackingPointList);
            var postData = {
                    tripDataJson: JSON.stringify(trip)
            }
            
            $.ajax({
              type: "POST",
              url: "app/saveTrip.php",
              data: postData,
              success: saveTripSuccess,
              dataType: "json"
            });
        }
    }
    else {
        alert("nothing to save...");
    }
}

function saveTripSuccess(data, textStatus, jqXHR) {
    alert(data);
}

function loadTripList() {
    $.ajax({
        type: "GET",
        url: "app/loadTrips.php",
        success: loadTripListSuccess,
        dataType: "json"
          });
}

function loadTripListSuccess(data, textStatus, jqXHR) {
    
    $('#tripList').html('');
    
    for (var i = 0; i < data.length; ++i) {
        $('#tripList').append('<li><span onClick="loadTripData(' + data[i].id + ')">'+data[i].name+'</span>');
    }
    
    showTripListSection();
}

function loadTripData(tripId) {
    $.ajax({
        type: "GET",
        url: "app/loadTripData.php?tripId="+tripId,
        success: loadTripDataSuccess,
        dataType: "json"
          });
}

function loadTripDataSuccess(data, textStatus, jqXHR) {
    // TODO add some error handling
    
    localStorage.clear();
    
    for (var i = 0; i< data.trackingPoints.length; ++i) {
        storePosition(getNewSequenceId(), data.trackingPoints[i]);
    }
    
    showTripDataSection();
    showTrip(data.trackingPoints);
    
}

function showTripDataSection(){
    $('#tripDataSection').show();
    $('#tripListSection').hide();
} 

function showTripListSection(){
    $('#tripDataSection').hide();
    $('#tripListSection').show();
} 

function determineCurrentPosition() {
    navigator.geolocation.getCurrentPosition(storeAndShowCurrentPosition,errorRetrievingCurrentPosition);
}