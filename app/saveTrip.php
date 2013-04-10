<?php
require_once '../bootstrap.php';
require_once '../service/tripService.php';

$tripDataJson = $_POST['tripDataJson'];

// TODO: create JSON output from a proper php object

if ($tripDataJson != null && !$tripDataJson == "") {
	$decodedTripData = json_decode($tripDataJson);
	$jsonError = json_last_error();
	
	if ($jsonError == JSON_ERROR_NONE) {
		saveJsonTrip($decodedTripData, $entityManager);
		echo "{\"status\":\"OK\",\"errorcode\":".JSON_ERROR_NONE."\"}";
	}
	else {
		echo "{\"status\":\"ERROR\",\"errorcode\":".$jsonError."\"}";
	}
}
else {
	echo "{\"status\":\"ERROR\",\"errorcode\":\"99\"}";
}