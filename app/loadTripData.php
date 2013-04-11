<?php
require_once '../bootstrap.php';
require_once '../service/tripService.php';

$tripId = $_GET['tripId'];
if (!empty($tripId)){
	$trip = $entityManager->getRepository('Trip')->find($tripId);
	$geolocationList = $entityManager->getRepository('Geolocation')->findBy(array("trip"=>$tripId));
	$trackingData = new TrackingData();
	$trackingData->name = $trip->getName();
	foreach($geolocationList as $geolocation) {
		$trackingPoint = new TrackingPoint();
		$trackingPoint->latitude = $geolocation->getLatitude();
		$trackingPoint->longitude = $geolocation->getLongitude();
		$trackingPoint->timestamp = $geolocation->getTimestamp();
		$trackingPoint->statusCode = "";
		array_push($trackingData->trackingPoints, $trackingPoint);
	}
}

echo json_encode($trackingData);


class TrackingData {
	public $trackingPoints = array();
	public $name;
}

class TrackingPoint {
	public $latitude;
	public $longitude;
	public $timestamp;
	public $statusCode;
}