<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

    $iniparsed = parse_ini_file(join(dirname(__DIR__,2),DIRECTORY_SEPARATOR,'wmp.ini'),true);

    //working directory
    define('WKDIR',$iniparsed['dir_path']);
    //conf array
    define('DB_CONF',$iniparsed['db_conf']);
    //allowed file types
    $ftypes = array();
    for($i=0;$i<count($iniparsed['allowed_file_types']);$i++){
        array_push($ftypes,$iniparsed['allowed_file_types']['allowed_file_type'.$i]);
    }
    define('ALLOWED_FILE_TYPES',$ftypes);
    //others
    define('RECURSIVE_SEARCH',$iniparsed['others']['recursive_dir']);
?>