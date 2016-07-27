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

}]);
