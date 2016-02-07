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
