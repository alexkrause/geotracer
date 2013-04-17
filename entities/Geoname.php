<?php
/**
 * @Entity @Table(name="geoname_light")
 **/
class Geoname
{
	/** @Id @Column(type="integer") @GeneratedValue **/
	protected $geonameid;
	
	/** @Column(type="string") **/
	protected $name;
	
	/** @Column(type="float") **/
    protected $latitude;

    /** @Column(type="float") **/
    protected $longitude;

    public function getName()
    {
    	return $this->name;
    }
    public function setName($name)
    {
    	$this->name = $name;
    }
    
    
    public function getLatitude()
    {
        return $this->latitude;
    }
    
    public function setLatitude($latitude)
    {
    	$this->latitude = $latitude;
    }

    public function getLongitude()
    {
        return $this->longitude;
    }

    public function setLongitude($longitude)
    {
        $this->longitude = $longitude;
    }
    
    
}