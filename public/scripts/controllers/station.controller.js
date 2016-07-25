app.controller('StationCtrl', ['$scope', '$localStorage', 'stationService',
    function($scope,  $localStorage, stationService){
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

                    $scope.station = station;
                    // now that we have the station, let's make an array to store the details
                    var details = Array(station.num_valves);
                    // loop through all ingredients in the station
                    for(var ingredient in station.ingredients) {
                        var current_ingredient = station.ingredients[ingredient];
                        details[current_ingredient.valve] = [current_ingredient.type, current_ingredient.amount, current_ingredient.flow_factor];
                    }
                    $scope.details = details;
                }
            });
        }

        $scope.stationEdit = false;

        // display Edit input
        $scope.editIPAddress = function() {
            $scope.stationEdit = true;
        };

        // save details to database and display values
        $scope.saveIPAddress = function() {
            stationService.saveIPAddress($scope.station._id, $scope.station.host, $scope.station.port);

            $scope.stationEdit = false;
        };
        
        // change the number of valves
        $scope.saveNumValves = function() {
            stationService.saveNumValves($scope.station._id, $scope.station.num_valves);
        };

}]);
