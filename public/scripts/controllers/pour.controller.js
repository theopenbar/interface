app.controller('PourCtrl', ['$scope', '$localStorage', '$location', '$anchorScroll', '$http',
               'drinksService', 'stationService', 'WebSocket',
    function($scope, $localStorage, $location, $anchorScroll, $http, drinksService, stationService, WebSocket){
               
        var station_id = $localStorage.stationId;
        // access the station stored under "station" for the user
        var stationPromise = stationService.getStation(station_id);
        stationPromise.then(function (station) {
            $scope.station = station;
        });

        var drinksPromise = drinksService.getDrinks();
        drinksPromise.then(function (drinks) {
            $scope.drinks = drinks;
        });
        
        $scope.WebSocket = WebSocket;

        // these 2 functions are for displaying the list of ingredients
        // so that the user can pour the drink if they wish
        $scope.isDrinkSelected = function(drink) {
            return $scope.drinkSelected == drink;
        };

        $scope.selectDrink = function(drink) {
            // hide additional ingredients alert when selecting a new drink
            $scope.addYourself = false;
            $scope.drinkSelected = drink;
            WebSocket.messages.length = 0;

            // need timeout so it runs after DOM is updated to show 'recipe'
            // http://stackoverflow.com/a/19889541
            setTimeout(function() {
                $location.hash('recipe');
                $anchorScroll();
            }, 0);
        };

        $scope.pourDrink = function(drink) {
            // Make Recipe selected for the user of ID
            
            WebSocket.sendCommand($scope.station.host, $scope.station.port, '01', drink._id);

            // hide recipe after successfully pouring
            // probably want to do this when commander returns with "OK"
            //$scope.drinkSelected = false;
        };

        /*
        Keep this logic in case we want to add the ability to pour drinks
        where we don't have all available ingredients.

        $scope.pourDrink = function(drink, station) {
            // stores any additional ingredients you need to add after
            // the machine pours what it can
            var addYourself = {};

            // loop through all ingredients in selected drink
            for(var ingredient in drink.recipe) {
                var station_ingredient = station.ingredients[ingredient];
                // see if that ingredient is in station
                if (station_ingredient == undefined){
                    // if not, add to addYourself object
                    addYourself[ingredient] = drink.recipe[ingredient];
                }
                else{
                    // cobble together a request
                    var time = drink.recipe[ingredient] * station_ingredient.oz2time;
                    var request = "http://" + station.ip_address + "?gpio=" + station_ingredient.pin + "&time=" + time;
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
        */
}]);
