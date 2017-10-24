<?php


Flight::route(' GET /pelicula/@metodo', function ($metodo) {


    $data = !empty($_REQUEST) ? $_REQUEST : json_decode(file_get_contents('php://input'), true);

    $obj = new pelicula();

    print $obj->mostrar();

    
});

Flight::route(' POST /pelicula/@metodo', function ($metodo) {
    
    
    $data = !empty($_REQUEST) ? $_REQUEST : json_decode(file_get_contents('php://input'), true);

    $obj = new pelicula();

    if($metodo == 'guardar'){
        print $obj->guardar($data);
    }

    if($metodo == 'eliminar'){
        print $obj->eliminar($data);
    }

    if($metodo == 'actualizar'){
        print $obj->actualizar($data);
    }
    
    if($metodo == 'api'){
        print $obj->api($data);
    }
        
    
        
});

Flight::route(' GET /genero/@metodo', function ($metodo) {
    
        $obj = new genero();
    
        print $obj->todos();    
    
});
    
    

    


Flight::start();