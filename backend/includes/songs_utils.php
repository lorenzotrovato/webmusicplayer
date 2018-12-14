<?php
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    require_once __DIR__. DIRECTORY_SEPARATOR . 'getid3' . DIRECTORY_SEPARATOR .'getid3.php';

    function getSongDataParsed($filename){
        $getID3 = new getID3;
        $filei = $getID3->analyze($filename);
        getid3_lib::CopyTagsToComments($filei);
        $sd = $filei['comments_html'];
        $datar = array();
        $datar['title'] = (isset($sd['title']) && count($sd['title'])>0) ? implode(" ",$sd['title']) : $filename;
        $datar['artist'] = (isset($sd['artist']) && count($sd['artist'])>0) ? implode(", ",$sd['artist']) : "";
        $datar['album'] = (isset($sd['album']) && count($sd['album'])>0) ? implode(", ",$sd['album']) : "";
        $datar['duration'] = convertDurationToSec($filei['playtime_string']);
        return $datar;
    }

    function getBase64Cover($filename){
        $getID3 = new getID3;
        $filei = $getID3->analyze($filename);
        if(isset($filei['id3v2']['APIC'][0]['data'])){
            return base64_encode($filei['id3v2']['APIC'][0]['data']);
        }else{
            return false;
        }
    }


    function convertDurationToSec($textdur){
        list($mins , $secs) = explode(':' , $textdur);
        return $secs = intval($secs + $mins*60);
    }
?>
