<?php


//require_once('../../vendor/autoload.php');

// Using Medoo namespace
use Medoo\Medoo;

class conectar extends Medoo{

    public function __construct()
    {

        // Initialize
        $database = [
            'database_type' => 'pgsql',
            'database_name' => 'prueba',
            'server' => 'localhost',
            'username' => 'postgres',
            'password' => 'zayro'
        ];

        parent::__construct($database);
    }
}
 

 



