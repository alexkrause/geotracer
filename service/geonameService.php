<?php
function findGeonamesInVicinity($latitude, $longitude, $distance, $entityManager) {
	
	
	$q = $entityManager->createQuery('select g from Geoname g where g.latitude > ?1
			and g.latitude < ?2 and g.longitude > ?3 and g.longitude < ?4
			order by g.name ASC');
	
	$lon1 = $longitude-$distance/abs(cos(deg2rad($latitude))*69);
	$lon2 = $longitude+$distance/abs(cos(deg2rad($latitude))*69);
	$lat1 = $latitude-($distance/69);
	$lat2 = $latitude+($distance/69);
	
	$q->setParameter(1, $lat1);
	$q->setParameter(2, $lat2);
	$q->setParameter(3, $lon1);
	$q->setParameter(4, $lon2);
	
	return $q->getResult();
	
}