<?php
/**
 * @Entity @Table(name="geolocation")
 **/
class Geolocation
{
    
	/** @Id @Column(type="integer") @GeneratedValue **/
	protected $id;
	
	/** @Column(type="float") **/
    protected $lat;

    /** @Column(type="float") **/
    protected $long;

    public function getLat()
    {
        return $this->lat;
    }
    public function setLat($lat)
    {
    	$this->lat = $lat;
    }

    public function getLong()
    {
        return $this->long;
    }

    public function setLong($long)
    {
        $this->long = $long;
    }
}