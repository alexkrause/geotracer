<?php
require_once '../bootstrap.php';
require_once '../service/tripService.php';

$tripdataJson = "{\"trackingPoints\":[{\"timestamp\":1365434998609,\"latitude\":48.136607,\"longitude\":11.577085,\"statusCode\":\"\"}],\"name\":\"test3\"}";
$decodedTripData = json_decode($tripdataJson);
var_dump($decodedTripData);

saveJsonTrip($decodedTripData, $entityManager);
