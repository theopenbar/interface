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

app.controller('PourCtrl', ['$scope', '$resource', '$location', '$anchorScroll', '$http',
               'drinksService', 'stationService',
    function($scope, $resource, $location, $anchorScroll, $http, drinksService, stationService){
        var url_params = $location.search();
        var station_id = url_params.id;

        // access the station stored under "station" for the user
        var stationPromise = stationService.getStation(station_id);
        stationPromise.then(function (station) {
            $scope.station = station;
        });

        var drinksPromise = drinksService.getDrinks();
        drinksPromise.then(function (drinks) {
            $scope.drinks = drinks;
        });

        // these 2 functions are for displaying the list of ingredients
        // so that the user can pout the drink if they wish
        $scope.isDrinkSelected = function(drink) {
            return $scope.drinkSelected == drink;
        };

        $scope.selectDrink = function(drink) {
            // hide additional ingredients alert when selecting a new drink
            $scope.addYourself = false;
            $scope.drinkSelected = drink;

            // need timeout so it runs after DOM is updated to show 'recipe'
            // http://stackoverflow.com/a/19889541
            setTimeout(function() {
                $location.hash('recipe');
                $anchorScroll();
            }, 0);
        };

        $scope.pourDrink = function(drink, station) {
            // stores any additional ingredients you need to add after
            // the machine pours what it can
            var addYourself = {};

            // loop through all ingredients in selected drink
            for(var ingredient in drink.recipe) {
                // see if that ingredient is in station
                if (station.ingredients[ingredient] == undefined){
                    // if not, add to addYourself object
                    addYourself[ingredient] = drink.recipe[ingredient];
                }
                else{
                    // cobble together a request
                    var request = "http://" + station.ip_address + "?gpio=" + station.ingredients[ingredient].pin + "&time=" + drink.recipe[ingredient];
                    // send it out
                    $http.get(request)
                        .then(function(response) {
                            // Should we do anything with the response?
                            // Should add code to deal with errors or timeout
                        });
                }
            }

            // hide recipe after successfully pouring
            $scope.drinkSelected = false;

            // if additional ingredients, show alert
            if (Object.keys(addYourself).length != 0){
                $scope.addYourself = addYourself;
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
            userService.putUser(user_id, {
                "station": station._id,
                "name": drink.name,
                "recipe": esp_recipe
            });

            $scope.user.name = drink.name;
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
