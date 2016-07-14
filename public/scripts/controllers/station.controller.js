app.controller('StationCtrl', ['$scope', '$localStorage', 'stationService',
    function($scope,  $localStorage, stationService){
        var station_id = $localStorage.stationId;
        if (station_id == undefined) {
            $scope.stationSelected = false;
        }
        else {
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
                        details[current_ingredient.pin] = [ingredient, current_ingredient.amount, current_ingredient.oz2time];
                    }
                    $scope.details = details;
                }
            });
        }
}]);
