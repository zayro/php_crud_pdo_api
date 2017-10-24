<?php

#require_once('../config/conexion.php');

class genero  extends conectar {


    public function todos(){

        $result = $this->select('genero', '*');
         
        return json_encode($result);

    }

  

}