<?php

require_once('../../includes/mysqliconn.php');

$boundingbox = array();
$boundingbox['minx'] = $_GET['minx'];
$boundingbox['miny'] = $_GET['miny'];
$boundingbox['maxx'] = $_GET['maxx'];
$boundingbox['maxy'] = $_GET['maxy'];

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
while ($stmt->fetch()) {	
	$addresses[] = array('id' => $address['id'],
			'name' => $address['name'],
			'url' => $address['url'],
			'lon' => $address['lon'],
			'lat' => $address['lat'],			
    );
}


echo json_encode($addresses);

