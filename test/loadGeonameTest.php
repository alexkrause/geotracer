<?php
require_once '../bootstrap.php';
require_once '../service/geonameService.php';

	


$geonames = findGeonamesInVicinity(48.1562972, 11.448109, 3, $entityManager);

var_dump($geonames);

