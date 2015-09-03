<?php
class TripData {
	public $id;
	public $name;
}

class TrackingData {
	public $trackingPoints = array();
	public $name;
}

class TrackingPoint {
	public $latitude;
	public $longitude;
	public $timestamp;
	public $statusCode;
	public $locationName;
}

class ResponseData {
	public $status = "ERROR";
	public $errorcode = "99";
}

class PopulationIndex {
	public $populationIndex;
}