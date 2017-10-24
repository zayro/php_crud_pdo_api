var app = angular.module('app', ['ngMaterial', 'md.data.table', 'ngRoute']);

/**
 * rutas de direccionamiento
 */
app.config(function($routeProvider) {
    $routeProvider.when('/list', {
            templateUrl: './app/view/list.html',
            controller: 'lista'
        })
        .when('/add', {
            templateUrl: './app/view/add.html',
            controller: 'crear'
        })
        .when('/api', {
            templateUrl: './app/view/api.html',
            controller: 'api'
        })
        .otherwise({ redirectTo: '/list' })
});

/**
 * controlador que se encargar de listar la vista
 */
app.controller('lista', function($scope, $http, $mdDialog, $mdToast, $httpParamSerializerJQLike) {

    $scope.ordenar = "nombre";

    $scope.eliminar = function($id) {
        var r = confirm("desea eliminar el id: " + $id);
        if (r == true) {
            $scope.delete($id);
        }
    }

    $scope.delete = function($id) {
        $http({
            method: 'POST',
            url: './app/pelicula/eliminar',
            data: "id=" + $id,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function successCallback(response) {
            $scope.fn_consultar();
        }, function errorCallback(response) {
            console.error(response);
        });
    };

    $scope.fn_consultar = function() {
        $http({
            method: 'GET',
            url: './app/pelicula/mostrar'
        }).then(function successCallback(response) {
            $scope.consulta = response.data;
            console.log('datos de consulta', $scope.consulta);
        }, function errorCallback(response) {
            console.error(response);
        });
    };

    $scope.fn_consultar();


    $scope.dialog = function(ev, url, data) {
        $mdDialog.show({
                controller: DialogController,
                templateUrl: url,
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: true,
                locals: {
                    items: data
                },
            })
            .then(function(answer) {
                console.log(answer);
                $scope.fn_consultar();
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    };


    function DialogController($scope, $http, $mdDialog, $mdToast, items, $httpParamSerializerJQLike) {

        if (items == '') {
            $scope.DataForm = {};

        } else {


            $scope.DataForm = items;

            $scope.DataForm.lanzamiento = new Date($scope.DataForm.lanzamiento);
        }

        $scope.fn_select_genero = function() {
            $http({
                method: 'GET',
                url: './app/genero/mostrar'
            }).then(function successCallback(response) {
                $scope.select_genero = response.data;

            }, function errorCallback(response) {
                console.error(response);
            });
        };

        $scope.fn_select_genero();

        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };

        $scope.actualizar = function($datos) {

            console.info($datos);

            $http({
                method: 'POST',
                url: './app/pelicula/actualizar',
                data: $httpParamSerializerJQLike($datos),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function successCallback(response) {
                console.info(response);
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('se actualizo correctamente')
                    .position("bottom right")
                    .hideDelay(3000)
                );
                $scope.answer(response);
            }, function errorCallback(response) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('ocurrio un error al actualizar')
                    .position("bottom right")
                    .hideDelay(3000)
                );
                console.error(response);
            });
        };


    }


});

/**
 * controlador que se encargar de enviar datos para almacenar
 */
app.controller('crear', function($scope, $http, $mdDialog, $mdToast, $location, $httpParamSerializerJQLike) {

    $scope.DataForm = {};

    $scope.fn_select_genero = function() {
        $http({
            method: 'GET',
            url: './app/genero/mostrar'
        }).then(function successCallback(response) {
            $scope.select_genero = response.data;

        }, function errorCallback(response) {
            console.error(response);
        });
    };

    $scope.fn_select_genero();


    $scope.guardar_imagen = function(file) {

        var formData = new FormData();

        /*
        angular.forEach($scope.files, function(obj) {
            if (!obj.isRemote) {
                formData.append('files[]', obj.lfFile);
            }
        });
        */

        formData.append('nombre', $scope.DataForm.nombre);
        formData.append('lanzamiento', $scope.DataForm.lanzamiento);
        formData.append('director', $scope.DataForm.director);
        formData.append('idGenero', $scope.DataForm.idGenero);
        formData.append('file', file);

        console.log(file);

        $http.post('./app/pelicula/guardar', formData, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(function(result) {
            // do sometingh
            console.log(result);
        }, function(err) {
            // do sometingh
        });



    };


    $scope.guardar = function($datos) {

        console.info($datos);

        $http({
            method: 'POST',
            url: './app/pelicula/guardar',
            data: $httpParamSerializerJQLike($datos),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function successCallback(response) {
            console.info(response);
            $mdToast.show(
                $mdToast.simple()
                .textContent('Se almaceno correctamente')
                .position("bottom right")
                .hideDelay(3000)
            );

            $location.path('/list');
        }, function errorCallback(response) {
            console.error(response);
        });
    };

});

/**
 *  controlador que se encargar cargar y almancenar el api
 */
app.controller('api', function($scope, $http, $mdToast, $httpParamSerializerJQLike) {

    $scope.fn_select_api = function() {
        $http({
            method: 'GET',
            url: 'https://swapi.co/api/films/'
        }).then(function successCallback(response) {

            console.log(response.data);

            $scope.api = response.data.results;

            $scope.guardar($scope.api);

        }, function errorCallback(response) {
            console.error(response);
        });
    };



    $scope.guardar = function($datos) {

        console.info($datos);

        $http({
            method: 'POST',
            url: './app/pelicula/api',
            data: { 'records': $datos }

        }).then(function successCallback(response) {
            console.info(response);
            $mdToast.show(
                $mdToast.simple()
                .textContent('se actualizo correctamente')
                .position("bottom right")
                .hideDelay(3000)
            );
        }, function errorCallback(response) {
            $mdToast.show(
                $mdToast.simple()
                .textContent('ocurrio un problema al cargar api')
                .position("bottom right")
                .hideDelay(3000)
            );
            console.error(response);
        });
    };


});