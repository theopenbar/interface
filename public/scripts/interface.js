var app = angular.module('interface', ['ngResource', 'ngRoute']);

app.service("drinksService", function($resource, $q) {
    // deferred means we can call this service after other stuff happens
    // this would be perfect for calling station using ID from user collection
    var deferred = $q.defer();

    var Drinks = $resource('/api/drinks');
    Drinks.query(function(drinks){
        deferred.resolve(drinks);
    });

    this.getDrinks = function() {
        return deferred.promise;
    };
});

app.service("stationService", function($resource, $q) {

    var deferred = $q.defer();

    this.getStation = function(station_id) {
        var Station = $resource('/api/station/:id', {id: station_id});
        Station.get(function(station){
            deferred.resolve(station);
        });

        return deferred.promise;
    };
});

app.service("userService", function($resource, $q) {

    var deferred = $q.defer();

    this.getUser = function(user_id) {
        var User = $resource('/api/user/:id', {id: user_id});
        User.get(function(user){
            deferred.resolve(user);
        });

        return deferred.promise;
    };

    this.putUser = function(user_id, data) {
        var User = $resource('/api/user/:id', {id: user_id}, {
          update: { method: 'PUT' }
        });
        User.update(data);

        return deferred.promise;
    };
});

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

app.controller('HomeCtrl', ['$scope', 'drinksService',
    function($scope, drinksService){
        var promise = drinksService.getDrinks();
        promise.then(function (drinks) {
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
               'userService', 'drinksService', 'stationService',
    function($scope, $resource, $location, $http, userService, drinksService, stationService){
        // get user_id from URL parameter ?id=...
        var url_params = $location.search();
        var user_id = url_params.id;

        // retreive that user's data from users collection
        var userPromise = userService.getUser(user_id);
        userPromise.then(function (user) {
            $scope.user = user;

            // access the station stored under "station" for the user
            var stationPromise = stationService.getStation(user.station);
            stationPromise.then(function (station) {
                $scope.station = station;
            });
        });

        var drinksPromise = drinksService.getDrinks();
        drinksPromise.then(function (drinks) {
            $scope.drinks = drinks;
        });

        $scope.isSelected = function(drink) {
            return $scope.selected == drink;
        };

        $scope.selectDrink = function(drink) {
            $scope.selected = drink;
        };

        $scope.queueDrink = function(drink, station) {
            var esp_recipe = {};

            // loop through all ingredients in selected drink
            for(var ingredient in drink.recipe) {
                // look in station for that ingredient's pin
                var pin = station.ingredients[ingredient].pin;
                var amount = drink.recipe[ingredient];

                // add to it in a format that the ESP can understand
                esp_recipe[pin.toString()] = amount;
            };

            // store it in the "users" collection with _id = user_id
            var putUserPromise = userService.putUser(user_id, {
                "station": station._id,
                "name": drink.name,
                "recipe": esp_recipe
            });
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
