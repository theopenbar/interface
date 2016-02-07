app.controller('StationCtrl', ['$scope', '$resource', '$location', 'stationService',
    function($scope, $resource, $location, stationService){
        var url_params = $location.search();
        var station_id = url_params.id;

        var stationPromise = stationService.getStation(station_id);
        stationPromise.then(function (station) {
            $scope.station = station;

            // now that we have the station, let's make an array to store the details
            var details = Array(station.num_valves);

            // loop through all ingredients in the station
            for(var ingredient in station.ingredients) {
                var current_ingredient = station.ingredients[ingredient];
                details[current_ingredient.pin] = [ingredient, current_ingredient.oz2time];
            }

            $scope.details = details;
        });
}]);
