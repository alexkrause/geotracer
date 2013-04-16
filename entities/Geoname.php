<?php
/**
 * @Entity @Table(name="geoname_light")
 **/
class Geoname
{
    
	/** @Column(type="name") **/
	protected $name;
	
	/** @Column(type="float") **/
	protected $longitude;
	
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
    
    public function getTimestamp()
    {
    	return $this->timestamp;
    }
    
}