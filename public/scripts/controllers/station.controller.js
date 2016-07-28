app.controller('StationCtrl', ['$scope', '$localStorage', '$location', 'stationService', 'drinksService',
    function($scope, $localStorage, $location, stationService, drinksService){

        // need to declare function before it is used
        $scope.findStation = function(station_id) {
            var stationPromise = stationService.getStation(station_id);
            stationPromise.then(function (station) {
                // check for errors
                if (station.error == "not_valid_objectId") {
                    // station_id is incorrect
                    $scope.stationSelected = false;
                    $scope.error = "Station ID is not formatted correctly.";
                }
                else if (station.error == "not_found") {
                    // station_id is incorrect
                    $scope.stationSelected = false;
                    $scope.error = "Station ID is not found.";
                }
                else {
                    // station_id is good
                    $scope.stationSelected = true;
                    // if it's good, save it locally
                    $localStorage.stationId = station_id;
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

                    // get Types of drinks for editing
                    var promise = drinksService.getTypes();
                    promise.then(function (types) {
                        $scope.types = types;
                    });
                }
            });
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
        $scope.saveNumValves = function() {
            stationService.saveNumValves($scope.station._id, $scope.station.num_valves);
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
            console.log("URL param");
            $scope.findStation(station_id);
        }
        // maybe it's in localStorage?
        else if ($localStorage.stationId != undefined){
            console.log("localStorage");
            $scope.findStation($localStorage.stationId);
        }
        // no station ID
        else {
            $scope.stationSelected = false;
        }
}]);
