var app = angular.module('interface', ['ngResource', 'ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        })
        .when('/add-drink', {
            templateUrl: 'partials/drink-form.html',
            controller: 'AddDrinkCtrl'
        })
        .when('/pour', {
            templateUrl: 'partials/pour.html',
            controller: 'PourCtrl'
        })
        .when('/station', {
            templateUrl: 'partials/view-station.html',
            controller: 'ViewStationCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

app.controller('HomeCtrl', ['$scope', '$resource',
    function($scope, $resource){
        var Drinks = $resource('/api/drinks');
        Drinks.query(function(drinks){
            $scope.drinks = drinks;
        });
}]);

app.controller('AddDrinkCtrl', ['$scope', '$resource',
    function($scope, $resource, $location) {
        $scope.save = function() {
            var Drinks = $resource('/api/drinks');
            Drinks.save($scope.drink, function() {
                $location.path('/');
            });
        };
}]);

app.controller('PourCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location){
        var url_params = $location.search();
        var station_id = url_params.id;

        var Station = $resource('/api/station/:id', {id: station_id});
        Station.get(function(station){
            $scope.station = station;
        });

        var Drinks = $resource('/api/drinks');
        Drinks.query(function(drinks){
            $scope.drinks = drinks;
        });

        $scope.isSelected = function(drink) {
            return $scope.selected == drink;
        };

        $scope.selectDrink = function(drink) {
            $scope.selected = drink;
        };
}]);

app.controller('ViewStationCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location){
        var url_params = $location.search();
        var station_id = url_params.id;

        var Station = $resource('/api/station/:id', {id: station_id});
        Station.get(function(station){
            $scope.station = station;
        });

        $scope.getMaxValves = function(num) {
            return new Array(num);
        }
}]);
