app.controller('StationCtrl', ['$scope', '$resource', '$location', 'stationService',
    function($scope, $resource, $location, stationService){
        var url_params = $location.search();
        var station_id = url_params.id;

        var stationPromise = stationService.getStation(station_id);
        stationPromise.then(function (station) {
            $scope.station = station;
        });

        $scope.getMaxValves = function(num) {
            return new Array(num);
        }
}]);
