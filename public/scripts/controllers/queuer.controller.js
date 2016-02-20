app.controller('QueueRCtrl', ['$scope', '$localStorage', '$http',
               'userService', 'drinksService', 'stationService',
    function($scope, $localStorage, $http, userService, drinksService, stationService){
        var user_id = $localStorage.userId;

        // retreive that user's data from users collection
        var userPromise = userService.getUser(user_id);
        userPromise.then(function (user) {
            $scope.user = user;

            // only display selected drink when its already been selected
            $scope.storedDrink = user.name;

            /*
            We need to get the station every time the user loads the page,
            because if the user changes bars, the database will change the
            stationId, and this is how the user would reload that value.
            */

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

        // these 2 functions are for displaying the list of ingredients
        // so that the user can pour the drink if they wish
        $scope.isDrinkSelected = function(drink) {
            return $scope.drinkSelected == drink;
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

            $scope.storedDrink = drink.name;
        };
}]);
