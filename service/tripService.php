<?php
function saveTrip($name, $geolocationList, $entityManager) {
	
	$trip = new Trip();
	$trip->setName($name);
	$entityManager->persist($trip);
	
	foreach ($geolocationList as $geolocation) {
		$newGeolocation = new Geolocation();
		$newGeolocation->setLatitude($geolocation->getLatitude());
		$newGeolocation->setLongitude($geolocation->getLongitude());
		$newGeolocation->setTimestamp($geolocation->getTimestamp());
		$newGeolocation->setTrip($trip);
		$entityManager->persist($newGeolocation);
		
	}
	
	$entityManager->flush();
	
}

function saveJsonTrip($tripdataJson, $entityManager) {
	
	$geolocationList = array();
	$tripData = json_decode($tripdataJson);
	
	if (!is_array($tripData->trackingPoints)
	 || is_null($tripData->name) || $tripData->name == "") {
		//TODO write logging code
		return;
	}	
	
	foreach ($tripData->trackingPoints as $trackingPoint) {
		$geolocation = new Geolocation();
		$geolocation->setLatitude($trackingPoint->latitude);
		$geolocation->setLongitude($trackingPoint->longitude);
		$geolocation->setTimestamp($trackingPoint->timestamp);
		array_push($geolocationList, $geolocation);
	}
	
	saveTrip($tripData->name, $geolocationList, $entityManager);
}

