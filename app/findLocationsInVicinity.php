<?php
require_once '../bootstrap.php';
require_once '../service/geonameService.php';
require_once 'responseClasses.php';
header('Content-Type: text/html; charset=utf-8');

$positionDataJson = $_POST["currentPosition"];

if ($positionDataJson != null && !$positionDataJson == "") {
	$decodedPositionData = json_decode($positionDataJson);
	$jsonError = json_last_error();

	if ($jsonError == JSON_ERROR_NONE) {
		$geonames = array();
		$vicinity = 2;
		while (sizeof($geonames) < 1 && $vicinity < 10) {
			$geonames = findGeonamesInVicinity($decodedPositionData->latitude, $decodedPositionData->longitude, $vicinity, $entityManager);
			$vicinity = $vicinity + 2;
		}
		
		$locationsInVicinity = array();
		foreach ($geonames as $geoname) {
			$trackingPoint = new TrackingPoint();
			$trackingPoint->latitude = $geoname->getLatitude();
			$trackingPoint->longitude = $geoname->getLongitude();
			$trackingPoint->locationName = $geoname->getName();
			$trackingPoint->timestamp = null;
			array_push($locationsInVicinity, $trackingPoint);
		}
		
	}
}

echo json_encode($locationsInVicinity);

