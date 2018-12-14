<?php
    require_once 'load_configs.php';

    $mysqli = new mysqli(DB_CONF['db_host'], DB_CONF['db_user'], DB_CONF['db_pass'], DB_CONF['db_name']) or die('db error');
?>