app.controller('StationCtrl', ['$scope', '$localStorage', 'stationService',
    function($scope,  $localStorage, stationService){
        var station_id = $localStorage.stationId;

        var stationPromise = stationService.getStation(station_id);
        stationPromise.then(function (station) {
            $scope.station = station;

            // now that we have the station, let's make an array to store the details
            var details = Array(station.num_valves);

            // loop through all ingredients in the station
            for(var ingredient in station.ingredients) {
                var current_ingredient = station.ingredients[ingredient];
                details[current_ingredient.pin] = [ingredient, current_ingredient.amount, current_ingredient.oz2time];
            }

            $scope.details = details;
        });
}]);
