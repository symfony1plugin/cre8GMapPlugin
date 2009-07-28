<?php
/*
 * Great source of information: http://www.meridianworlddata.com/Distance-Calculation.asp
 */
class DistanceCalculator 
{
	static private $radiusOfEarth = array(
		'miles' => 3963,
		'kilometers' =>  6377.8
	);
		
	/**
	 * Calculate distance based on latitude and longtitude
	 *
	 * @param float $latA
	 * @param float $longA
	 * @param float $latB
	 * @param float $longB
	 * @param string $units  Default: miles [miles, kilometers]
	 * @return float
	 */
	static public function getDistance($latA, $longA, $latB, $longB, $units = 'miles') 
	{
		$radius = isset(self::$radiusOfEarth[$units]) ? self::$radiusOfEarth[$units] : self::$radiusOfEarth['miles'];
		/*
		 * To convert latitude or longitude from decimal degrees to radians,
		 * divide the latitude and longitude values in this database by 180/pi, 
		 * or approximately 57.29577951. 
		 * The radius of the Earth is assumed to be 6,378.8 kilometers, or 3,963.0 miles
		 */
		$latA   = $latA   / 57.29577951;
		$longA  = $longA  / 57.29577951;
		$latB   = $latB   / 57.29577951;
		$longB  = $longB  / 57.29577951;

		if ($latA == $latB && $longA == $longB) {
			$dist = 0;
		} else {
			$dist = $radius * acos( sin($latA) * sin($latB) + cos($latA) * cos($latB) * cos($longB - $longA) );
		}
		return $dist;
	}

}