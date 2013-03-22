var locationTimer;

/**
if (Modernizr.geolocation) { 
        navigator.geolocation.getCurrentPosition(alert('OK'), alert('NOK'));
    } else {
        alert('no geolocation');
    }
 **/

function determineCurrentPosition() {
	navigator.geolocation.getCurrentPosition(storeCurrentPosition,errorRetrievingCurrentPosition);
}

function storeCurrentPosition(position) {

	var currentSequenceId = getCurrentStorageSequence();
	var previousPosition = getPositionFromLocalStorage(currentSequenceId);
	var trackingPoint = new TrackingPoint(new Date().getTime(), position.coords.latitude, position.coords.longitude, '');

	// only store position if the distance to the previous one is > 10m or there are no samples available yet    	
	if (!previousPosition || calculateDistance(trackingPoint, previousPosition) > 0.01){
		$('#collectedData').append('<tr><td>'+trackingPoint.timestamp+'</td><td>'+trackingPoint.latitude+'</td><td>'+trackingPoint.longitude+'</td></tr>');
		
		var totalDistance = calculateTotalDistance();
		var firstPosition = getPositionFromLocalStorage(1);

		var speed = 0;
		if (firstPosition) {
			var elapsedTime = calculateElapsedTime(firstPosition, trackingPoint);
			var speed = calculateTotalSpeed(totalDistance, elapsedTime);
		}
		$('#totaldistance').html('total distance: '+totalDistance+' km');
		$('#speed').html('Speed: '+speed+' km/h');

		var storageId=getNewSequenceId();
		storePosition(storageId, trackingPoint);
		// console.info("sequence: "+storageId+" lat: "+trackingPoint.latitude+" long: "+trackingPoint.longitude);
	}

	// set new timer for next checkpoint
	locationTimer = window.setTimeout("determineCurrentPosition()", 5000);
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

function calculateElapsedTime(point1, point2) {
	if (point1 && point2) {
		return point1.timestamp - point2.timestamp;
	}
	return 0;
}

function calculateTotalSpeed(distance, elapsedTimeMillies) {
	if (distance == null || elapsedTimeMillies == null
			|| isNaN(distance) || isNaN(elapsedTimeMillies) )
		return 0;
	
	if (elapsedTimeMillies == 0)
		return 0;
	
	return distance/(elapsedTimeMillies/1000/60/60);
}

function calculateDistance(point1, point2) {
	return getDistanceFromLatLonInKm(point1.latitude,point1.longitude,point2.latitude,point2.longitude);
}

function errorRetrievingCurrentPosition(error) {
	// local storage of error message
	var storageId=getNewSequenceId();

	var trackingPoint = new TrackingPoint(new Date().getTime(), null, null, error);
	storePosition(storageId, trackingPoint);


	// set new timer for next checkpoint
	locationTimer = window.setTimeout("determineCurrentPosition()", 10000);
}

function TrackingPoint(time, lati, longi, status) {
	this.timestamp = new Date().getTime();
	this.latitude = lati;
	this.longitude = longi;
	this.statusCode = status;
}

function getCurrentStorageSequence() {
	currentSequenceId = localStorage.getItem("currentSequenceId");
	if (currentSequenceId || !isNaN(currentSequenceId)) {
		return currentSequenceId*1; // convert to number
	}
	return 0;
}

function getLastPosition() {
	currentSequenceId = getCurrentStorageSequence();
	var lastPosition = getPositionFromLocalStorage(currentSequenceId);

	if (lastPosition == null) {
		return new TrackingPoint(null, 0,0, null);
	}
	return lastPosition;
}

function storePosition(id, trackingPoint) {
	var positionJson = JSON.stringify(trackingPoint);
	localStorage.setItem(id+":trackingPoint", positionJson);
}

function getPositionFromLocalStorage(id) {
	var positionJson = localStorage.getItem(id+':trackingPoint');
	if (positionJson) {
		return JSON.parse(positionJson);
	}
	return null;
}

function getNewSequenceId() {
	var increasedSequenceId = parseInt(getCurrentStorageSequence())+1;
	localStorage.setItem("currentSequenceId",  increasedSequenceId);
	return increasedSequenceId;
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
	navigator.geolocation.getCurrentPosition(storeCurrentPosition,errorRetrievingCurrentPosition);
}

function resetAll() {
	localStorage.clear();
	$('#collectedData').find("tr:gt(0)").remove();
	$('#totaldistance').html('total distance: 0 km');
	$('#speed').html('Speed: 0 km/h');
}

/* found: http://stackoverflow.com/questions/27928/how-do-i-calculate-distance-between-two-latitude-longitude-points */  
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2-lat1);  // deg2rad below
	var dLon = deg2rad(lon2-lon1); 
	var a = 
		Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
		Math.sin(dLon/2) * Math.sin(dLon/2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; // Distance in km
	return d;
}

function deg2rad(deg) {
	return deg * (Math.PI/180);
}