<?php
require_once '../bootstrap.php';
require_once '../service/geonameService.php';

$geonames = array();
$vicinity = 2;
while (sizeof($geonames) < 1 && $vicinity < 10) {
	$geonames = findGeonamesInVicinity(48.136607,11.577085, $vicinity, $entityManager);
	$vicinity = $vicinity + 2;	
}

var_dump($geonames);

