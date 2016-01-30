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
        .when('/queuer', {
            templateUrl: 'partials/queuer.html',
            controller: 'QueueRCtrl'
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

app.controller('PourCtrl', ['$scope', '$resource', '$location', '$http',
    function($scope, $resource, $location, $http){
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

        $scope.pourDrink = function(drink, station) {
            // loop through all ingredients in selected drink
            for(var ingredient in drink.recipe) {
                // cobble together a request
                var request = "http://" + station.ip_address + "?gpio=" + station.ingredients[ingredient].pin + "&time=" + drink.recipe[ingredient];
                // send it out
                $http.get(request)
                    .then(function(response) {
                        // Should we do anything with the response?
                        // Should add code to deal with errors or timeout
                    });
            }
        };
}]);

app.controller('QueueRCtrl', ['$scope', '$resource', '$location', '$http',
    function($scope, $resource, $location, $http){
        var url_params = $location.search();
        var user_id = url_params.id;

        var User = $resource('/api/user/:id', {id: user_id}, {
          update: { method: 'PUT' }
        });

        User.get(function(user){
            $scope.user = user;
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

        $scope.queueDrink = function(drink, station) {
            // loop through all ingredients in selected drink
            for(var ingredient in drink.recipe) {
                // cobble together a request
                var request = "http://" + station.ip_address + "?gpio=" + station.ingredients[ingredient].pin + "&time=" + drink.recipe[ingredient];
                // store it in the "users" collection with _id = user_id
            }
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
