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

        // display the list of ingredients
        // so that the user can pour the drink
        $scope.selectDrink = function(drink) {
            // only allow user to select a new drink if the previous one is done pouring
            // !pourInProgress is true while NOT pouring
            // pourComplete is true afterwards
            if (!WebSocket.pourInProgress() || WebSocket.pourComplete()) {
                // dismiss old status in case user didn't hit close first
                WebSocket.dismissPourStatus();

                // select drink and display ingredients
                $scope.drinkSelected = drink;
                $scope.listIngredients = true;

                // clear out old messages from previous pour
                WebSocket.messages.length = 0;

                // need timeout so it runs after DOM is updated to show 'recipe'
                // http://stackoverflow.com/a/19889541
                setTimeout(function() {
                    $location.hash('recipe');
                    $anchorScroll();
                }, 0);
            }
            else {
                alert("Please wait until pour is complete to select another drink")
            }
        };

        $scope.pourDrink = function(drink) {
            // tell the station to pour the drink
            WebSocket.sendCommand($scope.station.host, $scope.station.port, '01', drink._id);

            // hide recipe after we start pouring
            $scope.listIngredients = false;
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
