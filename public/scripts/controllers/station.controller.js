app.controller('StationCtrl', ['$scope', '$localStorage', '$location', 'stationService',
               'drinksService', 'WebSocket',
    function($scope, $localStorage, $location, stationService, drinksService, WebSocket){

        // need to declare functions before they are used
        $scope.stationReady = function(station) {
            // station_id is good
            $scope.selectStationUI = false;
            $scope.displayStationUI = true;
            // if it's good, save it locally
            $localStorage.stationId = station._id;
            // and remove the URL param
            $location.url($location.path())

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

            // get Types of drinks for editing
            var promise = drinksService.getTypes();
            promise.then(function (types) {
                $scope.types = types;
            });
        }

        $scope.findStation = function(station_id) {
            var stationPromise = stationService.getStation(station_id);
            stationPromise.then(function (station) {
                // check for errors
                if (station.error == "not_valid_objectId") {
                    // station_id is incorrect
                    $scope.selectStationUI = true;
                    $scope.error = "Station ID is not formatted correctly.";
                }
                else if (station.error == "not_found") {
                    // station_id is incorrect
                    $scope.selectStationUI = true;
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
                // fill up with blank ingredients and then set up GUI
                $scope.saveNumValves(station._id, station.num_valves);
            });
        }

        // remove station ID from localStorage and go back to stationSelect mode
        $scope.removeStationID = function() {
            delete $localStorage.stationId;
            $scope.displayStationUI = false;
            $scope.selectStationUI = true;
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

        // change the number of valves
        $scope.saveNumValves = function(station_id, num_valves) {
            var stationPromise = stationService.saveNumValves(station_id, num_valves);
            stationPromise.then(function (station) {
                $scope.stationReady(station);
            });
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

        // look for station in URL params
        var url_params = $location.search();
        var station_id = url_params.station;

        // if it's in the URL param, make sure it's correct
        if (station_id != undefined) {
            $scope.findStation(station_id);
        }
        // maybe it's in localStorage?
        else if ($localStorage.stationId != undefined){
            $scope.findStation($localStorage.stationId);
        }
        // no station ID
        else {
            $scope.selectStationUI = true;
        }
}]);
