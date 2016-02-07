app.controller('AddDrinkCtrl', ['$scope', '$resource', '$location', 'stationService', 'drinksService',
    function($scope, $resource, $location, stationService, drinksService) {
        var url_params = $location.search();
        var station_id = url_params.id;

        // need station to get all available ingredients
        var stationPromise = stationService.getStation(station_id);
        stationPromise.then(function (station) {
            $scope.station = station;
        });

        $scope.save = function() {
            drinksService.saveDrink($scope.drink);
        };
}]);
