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


$openWeatherMapApiKey = 'd8bc1c0a60e836388802191cb80c95e8';
$url = 'http://api.openweathermap.org/data/2.5/weather?units=metric&lat='.$lat.'&lon='.$long.'&APPID='.$openWeatherMapApiKey;


$json = file_get_contents( $url );
$data = json_decode($json);

// var_dump($data);

$weather = new Weather();
$weather->temperature = $data->main->temp;
$weather->description = $data->weather[0]->description;

echo json_encode($weather);