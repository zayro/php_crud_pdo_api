<?php

// habilitar compresiones
ini_set('zlib.output_compression', 'On');

// activar o desactivar mensajes de error
error_reporting(E_ERROR | E_WARNING | E_PARSE);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
ini_set('memory_limit', '256M');
error_reporting(E_ALL);

set_time_limit(0);

// zona horaria
date_default_timezone_set('America/Bogota');
header('Content-Type: application/json');