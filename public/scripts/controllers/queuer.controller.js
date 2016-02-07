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
