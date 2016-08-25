app.controller('StationCtrl', ['$rootScope', '$scope', '$state', '$localStorage', 'stationService', 'typeService', 'liquidService', 'SelectStation', 'WebSocket',
                        function($rootScope, $scope, $state, $localStorage, stationService, typeService, liquidService, SelectStation, WebSocket){

        // need to declare functions before they are used
        $scope.stationReady = function(station) {
            // false by default
            $scope.stationIPEdit = false;

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
            // for displaying "host":"port"
            $scope.colon = ':';

            // get all Types on page load
            var promise = typeService.getTypes();
            promise.then(function (types) {
                $scope.types = types;
            });
        }

        // remove station ID from localStorage and go back to station-select mode
        $scope.removeStationID = function() {
            delete $localStorage.stationId;
            // store current state in rootScope so we can return to it later
            $rootScope.returnToState = $state.current.name;
            // go to select-station view
            $state.go('select-station');
        }

        // send station ID to controller so it can GET the data from it
        $scope.sendIDtoController = function() {
            WebSocket.sendCommand($scope.station._id, '06', $scope.station._id);
        }

        // display Edit input
        $scope.editIPAddress = function() {
            $scope.stationIPEdit = true;
        };

        // save details to database and display values
        $scope.saveIPAddress = function() {
            stationService.saveIPAddress($scope.station._id, $scope.station.host, $scope.station.port);

            $scope.stationIPEdit = false;
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

        // tries to find the station ID,
        // and if it is there, query the database for it
        if (SelectStation.findStationOnPage() == true) {
            var stationPromise = stationService.getStation($localStorage.stationId);
            stationPromise.then(function (station) {
                $scope.stationReady(station);
            });
        }
        // if it's not there, findStationOnPage will redirect to /select-station
}]);
