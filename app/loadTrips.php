<?php
require_once '../bootstrap.php';
require_once '../service/tripService.php';
require_once 'responseClasses.php';

$tripList = findAllTrips($entityManager);
$frontendTripList = array();
foreach ($tripList as $trip) {
	$frontendTrip = new TripData();
	$frontendTrip->id = $trip->getId();
	$frontendTrip->name = $trip->getName();
	array_push($frontendTripList, $frontendTrip);
}

echo json_encode($frontendTripList);
