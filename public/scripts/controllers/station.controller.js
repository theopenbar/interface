app.controller('StationCtrl', ['$rootScope', '$scope', '$state', '$q','$localStorage',
    'stationService', 'liquidService', 'typeService', 'WebSocket',
    function($rootScope, $scope, $state, $q, $localStorage, stationService,
        liquidService, typeService, WebSocket) {

        // stores selections for liquid adding/editing
        $scope.liquidSelection = {"subtypes": null, "brands": null, "descriptions": null,
                                    "amounts": null, "type": null, "subtype": null, "brand": null,
                                    "amount": null, "pressurized": false};

        $scope.stationIPEdit = false;
        $scope.messageSuccess = null;
        $scope.selectedValve = null;
        $scope.editOnHandLiquidIndex = null;
        $scope.ingredientError = null;

        // tries to find the station ID,
        // and if it is there, query the database for it
        if (stationService.findStationOnPage() == true) {
            var stationPromise = stationService.getStation($localStorage.stationId);
            stationPromise.then(function(station) {
                $scope.station = station;
                updateLiquidDisplay();
            });
        }
        else {
            $scope.station = null;
        }
        // if it's not there, findStationOnPage will redirect to /select-station

        //get all Types on page load
        var promise = typeService.getTypes();
        promise.then(function (types) {
            $scope.types = types;
        });

        $scope.removeStationID = function() {
            delete $localStorage.stationId;
            // store current state in rootScope so we can return to it later
            $rootScope.returnToState = $state.current.name;
            // go to select-station view
            $state.go('select-station');
        }

        $scope.editIPAddress = function() {
            $scope.stationIPEdit = true;
        }

        $scope.saveIPAddress = function() {
            $scope.messageSuccess = null;
            $scope.editIPAddress = false;
            updateStation();
        }

        $scope.sendIDtoController = function() {
            WebSocket.sendCommand($scope.station._id, '06', $scope.station._id);
        }

        $scope.saveNumValves = function() {
            $scope.messageSuccess = null;
            updateStation();
        }

        $scope.selectType = function() {
            if($scope.editOnHandLiquidIndex != null) {
                $scope.liquidDisplay.onHandLiquids[$scope.editOnHandLiquidIndex].type =
                    $scope.liquidSelection.type;
            } else if($scope.selectedValve != null) {
                $scope.liquidDisplay.connectedLiquids[$scope.selectedValve-1].type =
                    $scope.liquidSelection.type;
            }
            // erase all values afterwards
            deleteFutureChoices("subtype");
            // get all Subtypes from that Type
            querySubtypes();
        }

        $scope.selectSubtype = function() {
            if($scope.editOnHandLiquidIndex != null) {
                $scope.liquidDisplay.onHandLiquids[$scope.editOnHandLiquidIndex].subtype =
                    $scope.liquidSelection.subtype;
            } else if($scope.selectedValve != null) {
                $scope.liquidDisplay.connectedLiquids[$scope.selectedValve-1].subtype =
                    $scope.liquidSelection.subtype;
            }
            // erase all values afterwards
            deleteFutureChoices("brand");
            // query for liquids from the Type and Subtype
            queryBrands();
        }

        $scope.selectBrand = function() {
            if($scope.editOnHandLiquidIndex != null) {
                $scope.liquidDisplay.onHandLiquids[$scope.editOnHandLiquidIndex].brand =
                    $scope.liquidSelection.brand;
            } else if($scope.selectedValve != null) {
                $scope.liquidDisplay.connectedLiquids[$scope.selectedValve-1].brand =
                    $scope.liquidSelection.brand;
            }
            // erase all values afterwards
            deleteFutureChoices("description");
            // query for descriptions from the Type, Subtype, and Brand
            queryDescriptions();
        }

        $scope.selectDescription = function() {
            if($scope.editOnHandLiquidIndex != null) {
                $scope.liquidDisplay.onHandLiquids[$scope.editOnHandLiquidIndex].description =
                    $scope.liquidSelection.description;
            } else if($scope.selectedValve != null) {
                $scope.liquidDisplay.connectedLiquids[$scope.selectedValve-1].description =
                    $scope.liquidSelection.description;
            }
            // erase all values afterwards
            deleteFutureChoices("amount");
            //last liquid option, so get id of liquid and set it in recipe
             $scope.liquidSelection.id =
                $scope.liquidSelection.descriptions.filter(function(v) {
                    return v.description === $scope.liquidSelection.description;
            })[0]._id;
            // query for amounts(bottles) from the selected liquid
            queryBottles();
        }

        $scope.addLiquidToStation = function() {
            $scope.messageSuccess = null;
            if($scope.selectedValve != null){
                // we're adding a connected liquid, find it's index if it's and existing one
                var index = -1;
                for(i=0;i<$scope.station.numValves;i++) {
                    if($scope.station.connectedLiquids[i] != null) {
                        if($scope.station.connectedLiquids[i].valve == $scope.liquidSelection.valve) {
                             index = i;
                        }
                    }
                }
                if(index > -1) {
                    // found... we're editing a liquid
                    $scope.station.connectedLiquids[index] =
                        {"valve":$scope.selectedValve,"id":$scope.liquidSelection.id,
                        "amount":$scope.liquidSelection.amount,
                        "pressurized":$scope.liquidSelection.pressurized};
                }
                else {
                    // this is a new liquid
                    $scope.station.connectedLiquids.push($scope.liquidSelection);
                }
                updateStation();
            }
            else if ($scope.editOnHandLiquidIndex != null) {
                // we're editing an on-hand liquid
                $scope.station.onHandLiquids[$scope.editOnHandLiquidIndex] =
                    {"id":$scope.liquidSelection.id};
                updateStation();
            }
            // else something is wrong
            else $scope.ingredientError = "Add Liquid Internal Error";
        }

        $scope.editConnectedLiquid = function(index) {
            // make sure were not already editing
            if($scope.editOnHandLiquidIndex == null && $scope.selectedValve == null) {
                $scope.selectedValve = index+1;
                $scope.liquidSelection = $scope.liquidDisplay.connectedLiquids[index];
                querySubtypes();
                queryBrands();
                queryDescriptions();
                queryBottles();
            }
            else $scope.ingredientError = "Already Editing!";
        }

        $scope.deleteConnectedLiquid = function(index) {
            // find matching liquid in station from liquid display
            var i = $scope.station.connectedLiquids.indexOf(
                $scope.liquidDisplay.connectedLiquids[index]);
            // If found, remove from array
            console.log(i);
            if(i > -1) $scope.station.connectedLiquids.splice(i,1);
            updateStation();
        }

        $scope.editOnHandLiquid = function(index) {
            // make sure were not already editing
            if($scope.editOnHandLiquidIndex == null && $scope.selectedValve == null) {
                $scope.editOnHandLiquidIndex = index;
                $scope.liquidSelection = $scope.liquidDisplay.onHandLiquids[index];
                querySubtypes();
                queryBrands();
                queryDescriptions();
                queryBottles();
            }
            else $scope.ingredientError = "Already Editing!";
        }

        $scope.deleteOnHandLiquid = function(index) {
            // find matching liquid in station from liquid display
            var i = $scope.station.onHandLiquids.indexOf(
                $scope.liquidDisplay.onHandLiquids[index]);
            // If found, remove from array
            console.log(i);
            if(i > -1) $scope.station.onHandLiquids.splice(i,1);
            updateStation();
        }

        $scope.addOnHandLiquid = function() {
            $scope.liquidDisplay.onHandLiquids.push(
                {"type":null,"subtype":null,"brand":null,"description":null});
            $scope.editOnHandLiquidIndex = $scope.station.onHandLiquids.length;
        }

        function updateStation(){
            var stationPromise = stationService.updateStation($scope.station);
            stationPromise.then(function (station) {
                $scope.station = station;
                updateLiquidDisplay();
                $scope.selectedValve = null;
                $scope.editOnHandLiquidIndex = null;
                $scope.liquidSelection = {"subtypes": null, "brands": null, "descriptions": null,
                                            "amounts": null, "type": null, "subtype": null, "brand": null,
                                            "amount": null, "pressurized": false};
                $scope.messageSuccess = "Station Updated!"
            });
        }

        function updateLiquidDisplay() {
            $scope.liquidDisplay = {"connectedLiquids":[],"onHandLiquids":[]};
            // iterate through all valves for station
            var connectedPromises = []; // array of promises to fill in loop
            for(i=0; i<$scope.station.numValves; i++) {
                // add place holder
                $scope.liquidDisplay.connectedLiquids[i] =
                    {"valve":i+1,"type":null, "subtype":null, "brand":null,"description":null,
                    "amount":null,"pressurized":false};
                if($scope.station.connectedLiquids[i]) {
                    // Liquid exists, copy info to correct index (by valve)
                    $scope.liquidDisplay.connectedLiquids[$scope.station.connectedLiquids[i].valve-1] =
                        $scope.station.connectedLiquids[i];
                    // add promise to get liquid info from ID
                    connectedPromises[$scope.station.connectedLiquids[i].valve-1] =
                        liquidService.getLiquid($scope.station.connectedLiquids[i].id);
                }
            }
            // Update liquidDisplay remaining info after promises fulfilled
            $q.all(connectedPromises).then(function(liquidInfo){
                for(i=0; i<$scope.station.numValves; i++) {
                    if(connectedPromises[i] != null) {
                        $scope.liquidDisplay.connectedLiquids[i].type = liquidInfo[i].type;
                        $scope.liquidDisplay.connectedLiquids[i].subtype = liquidInfo[i].subtype;
                        $scope.liquidDisplay.connectedLiquids[i].brand = liquidInfo[i].brand;
                        $scope.liquidDisplay.connectedLiquids[i].description = liquidInfo[i].description;
                    }
                }
            });
            // Setup promises to get all onHandLiquids Info
            var onHandPromises = [];
            for(i=0; i<$scope.station.onHandLiquids.length; i++) {
                onHandPromises[i] = liquidService.getLiquid($scope.station.onHandLiquids[i].id);
            }
            // Update liquidDisplay after promises fulfilled
            $q.all(onHandPromises).then(function(liquidInfo){
                for(i=0; i<onHandPromises.length; i++) {
                    $scope.liquidDisplay.onHandLiquids[i] = liquidInfo[i];
                }
            });

        }

        function deleteFutureChoices(state) {
            // erase all values after the current state
            switch (state) {
                // no "break" because you always want it to fall through
                case "subtype":
                    delete $scope.liquidSelection.subtype;
                    delete $scope.liquidSelection.subtypes;
                case "brand":
                    delete $scope.liquidSelection.brand;
                    delete $scope.liquidSelection.brands;
                case "description":
                    delete $scope.liquidSelection.description;
                    delete $scope.liquidSelection.descriptions;
                case "amount":
                    delete $scope.liquidSelection.amount;
                    delete $scope.liquidSelection.amounts;
                default:
                    delete $scope.liquidSelection.id;
            }
        }

        function querySubtypes() {
            // first query subtypes
            var promise = typeService.getSubtypes($scope.liquidSelection.type);
            promise.then(function (subtypes) {
                $scope.liquidSelection.subtypes = subtypes;
            });
        }

        function queryBrands() {
            var query = {
                "type" : $scope.liquidSelection.type,
                "subtype" : $scope.liquidSelection.subtype
            };
            var promise = liquidService.getLiquids(query);
            promise.then(function (brands) {
                if ($scope.liquidSelection.subtype == "*Any") {
                    // get liquid ID for "subtype" : "*Any"
                    // http://stackoverflow.com/a/7364203
                    $scope.liquidSelection.id = brands.filter(function(v) {
                        return v.subtype === "*Any"; // Filter out the appropriate one
                    })[0]._id;
                }
                else if ($scope.liquidSelection.subtype != null) {
                    // remove duplicate Brands
                    // http://stackoverflow.com/a/31963129
                    $scope.liquidSelection.brands = brands.reduceRight(function (r, a) {
                        r.some(function (b) { return a.brand === b.brand; }) || r.push(a);
                        return r;
                    }, []);
                }
            });
        }

        function queryDescriptions() {
            if ($scope.liquidSelection.brand == "*Any") {
                // get liquid ID for "brand" : "*Any"
                // http://stackoverflow.com/a/7364203
                 $scope.liquidSelection.id =
                    $scope.liquidSelection.brands.filter(function(v) {
                        return v.brand === "*Any"; // Filter out the appropriate one
                })[0]._id;
            }
            else if ($scope.liquidSelection.brand != null) {
                // get all Descriptions from that Type and Subtype and Brand
                var query = {
                    "type" : $scope.liquidSelection.type,
                    "subtype" : $scope.liquidSelection.subtype,
                    "brand" : $scope.liquidSelection.brand
                };
                var promise = liquidService.getLiquids(query);
                promise.then(function (descriptions) {
                    $scope.liquidSelection.descriptions = descriptions;
                });
            }
        }

        function queryBottles() {
            $scope.ingredientError = "Query Bottles Not Implemented";
        }
}]);
