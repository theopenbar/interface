app.controller('AddDrinkCtrl', ['$scope', '$localStorage', 'stationService', 'drinksService',
    function($scope, $localStorage, stationService, drinksService) {
        var station_id = $localStorage.stationId;

        // need station to get all available ingredients
        var stationPromise = stationService.getStation(station_id);
        stationPromise.then(function (station) {
            $scope.station = station;

            // now that we have the station, let's make an array to store the details
            var available_ingredients = [];

            // loop through all ingredients in the station
            for(var ingredient in station.ingredients) {
                available_ingredients.push(ingredient);
            }

            $scope.ingredients = available_ingredients;
        });

        $scope.addDrink = function() {
            var drink = $scope.drink;

            // loop through all ingredients and multiply by 100
            // to support the ESP format
            for(var ingredient in drink.recipe) {
                drink.recipe[ingredient] *= 100;
            }

            drinksService.saveDrink(drink);
        };
}]);
