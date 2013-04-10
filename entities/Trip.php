<?php
/**
 * @Entity @Table(name="trip")
 **/
class Trip {

	
	/** @Id @Column(type="integer") @GeneratedValue **/
	protected $id;
	
	/** @OneToMany(targetEntity="Geolocation", mappedBy="trip") **/
	protected $geolocationList;

	/** @Column(type="string") **/
	protected $name;
	
	public function getGeolocationList() {
		return $this->geolocationList;
	}
	
	public function setGeolocationList($geolocationList) {
		$this->geolocationList = $geolocationList;
	}
	
	public function getName() {
		return $this->name;
	}
	
	public function setName($name) {
		$this->name = $name;
	}
	
	public function getId() {
		return $this->id;
	}
	
}	