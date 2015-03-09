<?php

require_once('../../includes/mysqliconn.php');

$boundingbox = array();

$boundingbox['minx'] = (isset($_GET['minx'])) ? $_GET['minx']: 0;
$boundingbox['miny'] = (isset($_GET['miny'])) ? $_GET['miny']: 0;
$boundingbox['maxx'] = (isset($_GET['maxx'])) ? $_GET['maxx']: 0;
$boundingbox['maxy'] = (isset($_GET['maxy'])) ? $_GET['maxy']: 0;

if (isset($_GET['bbox'])) {
  $bbox = explode(',', $_GET['bbox']);
  $boundingbox['minx'] = $bbox[0];
  $boundingbox['miny'] = $bbox[1];
  $boundingbox['maxx'] = $bbox[2];
  $boundingbox['maxy'] = $bbox[3]; 
}


if (!($stmt = $mysqli->prepare("SELECT * FROM categories WHERE lon BETWEEN ? AND ? AND lat BETWEEN ? AND ?"))) {
	echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
}

if (!$stmt->bind_param("dddd", $boundingbox['minx'], $boundingbox['maxx'], $boundingbox['miny'], $boundingbox['maxy'])) {
	echo "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
}

$stmt->execute();

/* bind result variables */
$stmt->bind_result($address['id'], $address['name'], $address['url'], $address['lon'], $address['lat']);

$addresses = array();
$features = array();
while ($stmt->fetch()) {	
	$addresses[] = array('id' => $address['id'],
			'name' => $address['name'],
			'url' => $address['url'],
			'lon' => $address['lon'],
			'lat' => $address['lat'],			
    );
	$features[] = '{
		"type": "Feature",
		"properties": {
      "name": "' . $address['name'] . '" 
    },
		"geometry": {
		  "type": "Point",
     	  "coordinates": [' . $address['lon'] . ', ' . $address['lat'] . ' ]
        }}';
}

$json_output = implode(', ', $features);

?>
{
	"type": "FeatureCollection",
	"features": [
	<?php echo $json_output; ?>
	]
}
