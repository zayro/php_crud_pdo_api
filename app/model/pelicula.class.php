<?php

#require_once('../config/conexion.php'); wplay

class pelicula  extends conectar {


    public function todos(){

        $result = $this->select('pelicula', '*');
         
        return json_encode($result);

    }

    public function mostrar(){

        $result = $this->query('SELECT
        pelicula.nombre,
        genero.nombre as genero,
        pelicula.imagen,
        pelicula.lanzamiento,
        pelicula.director,
        pelicula."idPelicula",
        genero."idGenero"
        FROM
        pelicula
        INNER JOIN genero ON pelicula."idGenero" = genero."idGenero"
        ')->fetchAll(PDO::FETCH_CLASS);
            
        return json_encode($result);

    }

    public function guardar_imagen($data){  
        
        extract($data);
        
        $storage = new \Upload\Storage\FileSystem('./'); //Lugar a donde se moveran los archivos
        
                $file = new \Upload\File('imagen', $storage); //proporcionas el nombre del campo
        
                /*
                $file->addValidations(array(
                   new \Upload\Validation\Extension(array('jpg','png','gif','jpeg')), //validas que sea una extensión valida
                   new \Upload\Validation\Mimetype(array('image/jpeg','image/png','image/gif')), //validas el tipo de imagen
                   new \Upload\Validation\Size('20k'), //validas que no exceda el tamaño
                   new \Ultra\Validation\Dimension(100,100), //comprobamos que la imagen no exceda de 100 x 100 px
                ));
                */
        
                try {
                    $file->upload(); // mover el archivo

                    $idPelicula = $this->max('pelicula', 'idPelicula') + 1;
                    
                            $result = $this->insert("pelicula", 
                            ["idPelicula" => $idPelicula,
                            "nombre" => $nombre,
                            "imagen" => $file->getNameWithExtension(),
                            "lanzamiento" => $lanzamiento,
                            "idGenero" => $idGenero]);                   
        
              
                } catch (\Upload\Exception $e) {
                    //Solo si existe un error en la operación
                    print_r($e->getMessage());
                }
        

        return json_encode($result);
    }

    public function guardar($data){  
        
        extract($data);
        
        $idPelicula = $this->max('pelicula', 'idPelicula') + 1;
        
        $result = $this->insert("pelicula", 
        ["idPelicula" => $idPelicula,
        "nombre" => $nombre,
        "imagen" => $imagen,
        "director" => $director,
        "lanzamiento" => $lanzamiento,
        "idGenero" => $idGenero]);   

        return json_encode($result);
    }
    
    public function actualizar($data){

        extract($data);

        
        $result = $this->update("pelicula", 
        [
        "nombre" => $nombre,
        "imagen" => $imagen,
        "director" => $director,
        "lanzamiento" => $lanzamiento,
        "idGenero" => $idGenero],  [
            "idPelicula" => $idPelicula]
        );   

        return json_encode($result);
    }

    public function eliminar($data){

        extract($data);

        $this->delete("pelicula", [  "idPelicula" =>  $id  ]);
    }

    public function api($data){

        //$parametros = json_decode($data['records'], true);

        $parametros = $data['records'];

        $masivo = array();

        $i = 0;

        foreach ($parametros as $key => $val) {
            ++$i;

            $val['idAPi'] = $this->max('api', 'idAPi') + $i;

            unset($val['characters']);
            unset($val['planets']);
            unset($val['opening_crawl']);
            unset($val['starships']);
            unset($val['created']);
            unset($val['edited']);
            unset($val['url']);
            unset($val['vehicles']);
            unset($val['species']);      
                        

            array_push($masivo, $val);
        }

        print_r($masivo);

        $result = $this->insert('api', $masivo);
        
    
    }

}