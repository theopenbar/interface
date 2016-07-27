app.controller('StationCtrl', ['$scope', '$localStorage', 'stationService', 'drinksService',
    function($scope,  $localStorage, stationService, drinksService){
        var station_id = $localStorage.stationId;
        $scope.stationSelected = false;
        if (station_id != undefined) {
            var stationPromise = stationService.getStation(station_id);
            stationPromise.then(function (station) {
                // check for errors
                if (station.error == "not_valid_objectId") {
                    $scope.error = "Station ID is not formatted correctly";
                }
                else if (station.error == "not_found") {
                    $scope.error = "Station ID is not found";
                }
                else {
                    // station_id is good
                    $scope.stationSelected = true;

                    // need array of "actual" ingredients to display correctly
                    $scope.actual = [];
                    for (var ingredient in station.ingredients) {
                        if (station.ingredients[ingredient].type == ""){
                            $scope.actual.push(false);
                        }
                        else {
                            $scope.actual.push(true);
                        }
                    }

                    $scope.station = station;
                }
            });
        }

        var promise = drinksService.getTypes();
        promise.then(function (types) {
            $scope.types = types;
        });

        $scope.stationIPEdit = false;

        // display Edit input
        $scope.editIPAddress = function() {
            $scope.stationIPEdit = true;
        };

        // save details to database and display values
        $scope.saveIPAddress = function() {
            stationService.saveIPAddress($scope.station._id, $scope.station.host, $scope.station.port);

            $scope.stationIPEdit = false;
        };

        // change the number of valves
        $scope.saveNumValves = function() {
            stationService.saveNumValves($scope.station._id, $scope.station.num_valves);
        };

        // edit an ingredient
        $scope.editIngredient = function(event) {
            // http://stackoverflow.com/a/31956122
            // and index is higher by 1
            var index = event.target.id - 1;
            $scope.actual[index] = false;
        };

        // save an ingredient
        $scope.saveIngredient = function(event) {
            // http://stackoverflow.com/a/31956122
            // and index is higher by 1
            var index = event.target.id - 1;

            // get that index's ingredient information
            var ingredient = $scope.station.ingredients[index];

            // save the changes to the database
            stationService.saveIngredient($scope.station._id, ingredient);

            $scope.actual[index] = true;
        };

}]);
