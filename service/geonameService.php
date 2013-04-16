<?php
function findGeonamesInVicinity($latitude, $longitude, $distance, $entityManager) {
	
	$geonameRepository = $entityManager->getRepository('Geoname');
	$qb = $entityManager->createQueryBuilder();
	
	$lon1 = $longitude-$distance/abs(cos(radians($latitude))*69);
	$lon2 = $longitude+$distance/abs(cos(radians($latitude))*69);
	$lat1 = $latitude-($distance/69);
	$lat2 = $latitude+($distance/69);
	
	$qb->add('select', 'geoname')
	->add('from', 'geoname_light gl')
	->add('where', 'geoname.latitude > ?1')
	->add('where', 'geoname.latitude < ?2')
	->add('where', 'geoname.longitude > ?3')
	->add('where', 'geoname.longitude < ?4')
	->add('orderBy', 'geoname.name ASC')
	->setParameter(1, $lat1)
	->setParameter(2, $lat2)
	->setParameter(1, $lon1)
	->setParameter(2, $lon2);
	
	$query = $qb->getQuery();
	return $query->getArrayResult();
	
}