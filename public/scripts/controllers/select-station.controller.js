app.controller('SelectStationCtrl', ['$rootScope', '$scope', '$state', '$localStorage', '$location', 'stationService',
    function($rootScope, $scope, $state, $localStorage, $location, stationService){

        $scope.station_id = null;

        $scope.stationReady = function(station) {
            // if it's good, save it locally
            $localStorage.stationId = station._id;
            // and remove the URL param
            $location.url($location.path());
            
            if ($rootScope.returnToState != undefined) {
                $state.go($rootScope.returnToState);
            }
            else {
                $state.go('home');
            }
        }

        $scope.findStation = function(station_id) {
            var stationPromise = stationService.getStation(station_id);
            stationPromise.then(function (station) {
                // check for errors
                if (station.error == "not_valid_objectId") {
                    // station_id is incorrect
                    $scope.error = "Station ID is not formatted correctly.";
                }
                else if (station.error == "not_found") {
                    // station_id is incorrect
                    $scope.error = "Station ID is not found.";
                }
                else {
                    $scope.stationReady(station);
                }
            });
        }

       // create a new station and return ID
        $scope.createStation = function() {
            // create base station
            var promise = stationService.putStation();
            promise.then(function (station) {
                $scope.stationReady(station);
            });
        }

}]);
