<?php
require_once '../bootstrap.php';
require_once '../service/tripService.php';

$tripList = findAllTrips($entityManager);
foreach ($tripList as $trip) {
	echo $trip->getName();
}

