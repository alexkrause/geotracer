<?php
require_once '../bootstrap.php';
require_once '../service/tripService.php';

$geolocations = findGeolocationsForTrip(1, $entityManager);
echo $geolocations[0]->getTimestamp();