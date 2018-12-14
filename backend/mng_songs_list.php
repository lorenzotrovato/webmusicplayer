<?php
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
    require_once 'includes/load_configs.php';
    include 'includes/dbconn.php';
    require_once 'includes/songs_utils.php';

    if(RECURSIVE_SEARCH === "true"){
        $wkdircont = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(realpath(WKDIR)));
    }else{
        $wkdircont = scandir(realpath(WKDIR));
    }
    
    //check deleted songs
    $q = $mysqli->query('SELECT * FROM songs');
    while($s = $q->fetch_assoc()){
        if(!file_exists(WKDIR .DIRECTORY_SEPARATOR.basename($s['file_name']))){ 
            $mysqli->query('DELETE FROM songs WHERE file_name="'.$s['file_name'].'"');
        }
    }
    //check for new songs
    foreach($wkdircont as $file){
        if(file_exists($file) && !is_dir($file)){
            $file = str_replace(WKDIR . DIRECTORY_SEPARATOR,'',$file);
            if(in_array(mime_content_type(WKDIR .DIRECTORY_SEPARATOR.$file),ALLOWED_FILE_TYPES)){
                $fp = hash_file('sha256',WKDIR .DIRECTORY_SEPARATOR.$file);
                if(!songAlreadyExists($fp)){
                    $songdata = getSongDataParsed(WKDIR .DIRECTORY_SEPARATOR.$file);
                    $qrIns = 'INSERT INTO songs(title, artist, album, duration, file_hash, file_name) VALUES (
                    "'.$mysqli->real_escape_string($songdata['title']).'",
                    "'.$mysqli->real_escape_string($songdata['artist']).'",
                    "'.$mysqli->real_escape_string($songdata['album']).'",
                    "'.$mysqli->real_escape_string($songdata['duration']).'",
                    "'.$mysqli->real_escape_string($fp).'",
                    "'.$mysqli->real_escape_string($file).'"
                    )';
                    $mysqli->query($qrIns);
                }
            }
        }
    }

    echo "done";

    function songAlreadyExists($fingerprint){
        require_once 'includes/load_configs.php';
        include 'includes/dbconn.php';
        $q = $mysqli1->query('SELECT file_hash FROM songs WHERE file_hash="'.$mysqli1->real_escape_string($fingerprint).'"');
        return $q->num_rows > 0;
    }
?>