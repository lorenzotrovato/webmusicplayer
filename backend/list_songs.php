<?php
/*
RETURN JSON OBJECT OF SONGS ON DB
*/
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
    require_once 'includes/dbconn.php';

    if(!($mysqli instanceof mysqli)){
        die('db connection error');
    }

    $query = $mysqli->query('SELECT * FROM songs');
    $songslist = $query->fetch_all(MYSQLI_ASSOC);
    header('Content-Type: application/json');
    echo json_encode($songslist);
 
?>


