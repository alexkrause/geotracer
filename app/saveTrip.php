<?php
require_once '../bootstrap.php';
require_once '../service/tripService.php';

$tripdataJson = $_POST['tripDataJson'];

if ($tripdataJson != null && !$tripdataJson == "") {
	$decodedTripData = json_decode($tripdataJson);
	$jsonError = json_last_error();
	
	if ($jsonError == JSON_ERROR_NONE) {
		saveJsonTrip($decodedTripData, $entityManager);
		echo "{\"status\":\"OK\",\"errorcode\":".JSON_ERROR_NONE."\"}";
	}
	else {
		echo "{\"status\":\"ERROR\Ó,\"errorcode\":".$jsonError."\"}";
	}
}
else {
	echo "{\"status\":\"ERROR\Ó,\"errorcode\":\"99\"}";
}