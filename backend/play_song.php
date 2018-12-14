<?php
    /*
    OUTPUT BINARY AUDIO DATA FROM SELECTED FILE
    */
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
    require_once 'includes/load_configs.php';
    require_once 'includes/dbconn.php';

    if(!isset($_GET['sid']) || $_GET['sid']==""){
        die('error missing id');
    }

    if(!($mysqli instanceof mysqli)){
        die('Error: mysqli');
    }

    $sid = intval($_GET['sid']);
    //get audio path
    $q = $mysqli->query('SELECT file_name FROM songs WHERE id="' . $mysqli->real_escape_string($sid) . '"');
    $path = $q->fetch_assoc()['file_name'];

    stream(WKDIR . '/' . $path);


    function stream($file, $content_type = 'application/octet-stream') {
        @error_reporting(0);
        if (!file_exists($file)) {
            header("HTTP/1.1 404 Not Found");
            exit;
        }
        $content_type = mime_content_type($file);
        // Get file size
        $filesize = sprintf("%u", filesize($file));
        // Handle 'Range' header
        if(isset($_SERVER['HTTP_RANGE'])){
            $range = $_SERVER['HTTP_RANGE'];
        }elseif($apache = apache_request_headers()){
            $headers = array();
            foreach ($apache as $header => $val){
                $headers[strtolower($header)] = $val;
            }
            if(isset($headers['range'])){
                $range = $headers['range'];
            }
            else $range = FALSE;
        } else $range = FALSE;
        //Is range
        if($range){
            $partial = true;
            list($param, $range) = explode('=',$range);
            // Bad request - range unit is not 'bytes'
            if(strtolower(trim($param)) != 'bytes'){ 
                header("HTTP/1.1 400 Invalid Request");
                exit;
            }
            // Get range values
            $range = explode(',',$range);
            $range = explode('-',$range[0]); 
            // Deal with range values
            if ($range[0] === ''){
                $end = $filesize - 1;
                $start = $end - intval($range[0]);
            } else if ($range[1] === '') {
                $start = intval($range[0]);
                $end = $filesize - 1;
            }else{ 
                // Both numbers present, return specific range
                $start = intval($range[0]);
                $end = intval($range[1]);
                if ($end >= $filesize || (!$start && (!$end || $end == ($filesize - 1)))) $partial = false; // Invalid range/whole file specified, return whole file
            }
            $length = $end - $start + 1;
        }
        // No range requested
        else $partial = false; 

        // Send standard headers
        header("Content-Type: $content_type");
        header("Content-Length: " . ($partial ? $length : $filesize));
        header('Accept-Ranges: bytes');

        // send extra headers for range handling...
        if ($partial) {
            header('HTTP/1.1 206 Partial Content');
            header("Content-Range: bytes $start-$end/$filesize");
            if (!$fp = fopen($file, 'rb')) {
                header("HTTP/1.1 500 Internal Server Error");
                exit;
            }
            if ($start) fseek($fp,$start);
            while($length){
                set_time_limit(0);
                $read = ($length > 8192) ? 8192 : $length;
                $length -= $read;
                print(fread($fp,$read));
            }
            fclose($fp);
        }
        //just send the whole file
        else readfile($file);
        exit;
    }
?>