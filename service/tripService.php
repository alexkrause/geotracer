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

function saveJsonTrip($decodedTripData, $entityManager) {
	
	$geolocationList = array();
	
	
	if (!is_array($decodedTripData->trackingPoints)
	 || is_null($decodedTripData->name) || $decodedTripData->name == "") {
		//TODO write logging code
		return;
	}	
	
	foreach ($decodedTripData->trackingPoints as $trackingPoint) {
		$geolocation = new Geolocation();
		$geolocation->setLatitude($trackingPoint->latitude);
		$geolocation->setLongitude($trackingPoint->longitude);
		$geolocation->setTimestamp($trackingPoint->timestamp);
		array_push($geolocationList, $geolocation);
	}
	
	saveTrip($decodedTripData->name, $geolocationList, $entityManager);
}


function findAllTrips($entityManager) {
	$tripRepository = $entityManager->getRepository('Trip');
	return $tripRepository->findBy(array(), array("name"=>"asc"));
}

function findGeolocationsForTrip($tripId, $entityManager) {
	return $entityManager->getRepository('Geolocation')->findBy(array('trip' => $tripId));
}

function findTripById($tripId, $entityManager) {
	return $entityManager->getRepository('Trip')->find($tripId);
} 