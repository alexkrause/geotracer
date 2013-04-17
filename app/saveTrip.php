<?php
// use Doctrine\DBAL\Platforms\Keywords\ReservedKeywordsValidator;
require_once '../bootstrap.php';
require_once '../service/tripService.php';
require_once 'responseClasses.php';

$tripDataJson = $_POST["tripDataJson"];

// TODO: create JSON output from a proper php object
$responseData = new ResponseData();

if ($tripDataJson != null && !$tripDataJson == "") {
	$decodedTripData = json_decode($tripDataJson);
	$jsonError = json_last_error();
	
	if ($jsonError == JSON_ERROR_NONE) {
		saveJsonTrip($decodedTripData, $entityManager);
		$responseData->status="OK";
		$responseData->errorcode = JSON_ERROR_NONE;
	}
	else {
		$responseData->status="ERROR";
		$responseData->errorcode = $jsonError;
	}
}

echo json_encode($responseData);



