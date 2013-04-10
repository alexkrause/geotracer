<?php
/**
 * @Entity @Table(name="geolocation")
 **/
class Geolocation
{
    
	/** @Id @Column(type="integer") @GeneratedValue **/
	protected $id;
	
	/** @Column(type="bigint") **/
	protected $timestamp;
	
	/** @Column(type="float") **/
    protected $latitude;

    /** @Column(type="float") **/
    protected $longitude;

    /** @ManyToOne(targetEntity="Trip", inversedBy="geolocationList") **/
    protected $trip;
    
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
    
    public function setTimestamp($timestamp)
    {
    	$this->timestamp = $timestamp;
    }
    
    public function getTrip()
    {
    	return $this->trip;
    }
    
    public function setTrip($trip)
    {
    	$this->trip = $trip;
    }
}