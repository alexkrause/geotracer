<?php
require_once 'responseClasses.php';
header('Content-Type: text/html; charset=utf-8');

if ($_GET['latitude'] != null && $_GET['longitude']) {
	$lat = $_GET['latitude'];
	$long = $_GET['longitude'];
}
else {
	$lat = 0;
	$long = 0;
}


$googlePlacesApiKey = 'AIzaSyAYXl5J9pNHqwdm4em7DCExaVzw-wLfT8A';

$json = file_get_contents('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='.$lat.','.$long.'&radius=200&types=atm|bakery|bank|bar|bus_station|cafe|church|city_hall|clothing_store|convenience_store|dentist|department_store|doctor|establishment|finance|food|gas_station|grocery_or_supermarket|mosque|parking|pharmacy|place_of_worship|restaurant|store|subway_station|synagogue|taxi_stand|&name=&key='.$googlePlacesApiKey);
$data = json_decode($json);

$populationIndex = new PopulationIndex();
$populationIndex->populationIndex = count($data->results); 

echo json_encode($populationIndex);