<?php
    /*
    OUTPUT BASE64 COVER
    */
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
    
    require_once 'includes/dbconn.php';
    require_once 'includes/songs_utils.php';

    if(!isset($_GET['sid']) || $_GET['sid']==""){
        die();
    }

    if(!($mysqli instanceof mysqli)){
        die();
    }

    $sid = intval($_GET['sid']);
    //get audio path
    $q = $mysqli->query('SELECT file_name FROM songs WHERE id="' . $mysqli->real_escape_string($sid) . '"');
    $path = $q->fetch_assoc()['file_name'];

    echo getBase64Cover(WKDIR . '/' . $path);
?>