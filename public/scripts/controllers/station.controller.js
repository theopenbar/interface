app.controller('StationCtrl', ['$rootScope', '$scope', '$state', '$q','$localStorage',
    'stationService', 'liquidService', 'typeService', 'WebSocket',
    function($rootScope, $scope, $state, $q, $localStorage, stationService,
        liquidService, typeService, WebSocket) {

        // stores selections for liquid adding/editing
        $scope.liquidSelection = {"subtypes": [], "brands": [], "descriptions": [],"amounts": [],
                                    "id":null, "type":null, "subtype":null, "brand":null,"description":null,
                                    "amount": null, "pressurized": false};
        $scope.stationIPEdit = false;
        $scope.messageSuccess = null;
        $scope.selectedValve = null;
        $scope.editOnHandLiquidIndex = null;
        $scope.ingredientError = null;
        $scope.station = {"name":null, "connectedLiquids":[],"onHandLiquids":[],"numValves":0,"host":null,"port":null};

        // tries to find the station ID,
        // and if it is there, query the database for it
        if (stationService.findStationOnPage() == true) {
            var stationPromise = stationService.getStation($localStorage.stationId);
            stationPromise.then(function(station) {
                $scope.station = station;
                updateLiquidDisplay();
            });
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

        $scope.sendIDtoController = function() {
            WebSocket.sendCommand($scope.station._id, '06', $scope.station._id);
        }

        $scope.saveStation = function() {
            $scope.messageSuccess = null;
            $scope.stationIPEdit = false;
            // remove any liquids connected to higher valves if the numValves decreased
            if($scope.station.numValves < $scope.station.connectedLiquids.length){
                $scope.station.connectedLiquids.filter(function(liquid, index, liquids){
                    return liquid.valve <= $scope.station.numValves;
                });
            }
            updateStation();
        }

        $scope.selectType = function() {
            // erase all values afterwards
            deleteFutureChoices("subtype");
            // set display values to match new seletion
            updateDisplayFromSelection();
            // get all Subtypes from that Type
            querySubtypes();
        }

        $scope.selectSubtype = function() {
            // erase all values afterwards
            deleteFutureChoices("brand");
            // set display values to match new seletion
            updateDisplayFromSelection();
            // query for liquids from the Type and Subtype
            queryBrands();
        }

        $scope.selectBrand = function() {
            // erase all values afterwards
            deleteFutureChoices("description");
            // set display values to match new seletion
            updateDisplayFromSelection();
            // query for descriptions from the Type, Subtype, and Brand
            queryDescriptions();
        }

        $scope.selectDescription = function() {
            // erase all values afterwards
            deleteFutureChoices("amount");
            //last liquid option, so get id of liquid and set it in recipe
             $scope.liquidSelection.id =
                $scope.liquidSelection.descriptions.filter(function(v) {
                    return v.description === $scope.liquidSelection.description;
            })[0]._id;
            // set display values to match new seletion
            updateDisplayFromSelection();
            // query for amounts(bottles) from the selected liquid
            queryBottles();
        }

        $scope.selectPressurized = function() {
            $scope.liquidDisplay.connectedLiquids[$scope.selectedValve-1].pressurized =
                $scope.liquidSelection.pressurized;
        }

        $scope.selectAmount = function() {
            $scope.liquidDisplay.connectedLiquids[$scope.selectedValve-1].amount =
                $scope.liquidSelection.amount;
        }

        $scope.addLiquidToStation = function() {
            $scope.messageSuccess = null;
            // check that liquid is fully filled in (i.e. has an ID assigned, and an amount if a connected liquid)
            if($scope.liquidSelection.id == null
                || ($scope.liquidSelection.amount == null && $scope.selectedValve != null)) {
                $scope.ingredientError = "Please fill in all forms for this liquid.";
            }
            else {
                // otherwise good, clear error if there and continue
                $scope.ingredientError = null;
                if($scope.selectedValve != null){
                    // we're adding a connected liquid, find it's index if it is an existing one
                    var i = -1;
                    $scope.station.connectedLiquids.filter(function(liquid, cur_index, liquids){
                        if(liquid.valve == $scope.selectedValve) {
                            i = cur_index;
                            return true;
                        }
                        else return false;
                    });
                    if(i > -1) {
                        // found... we're editing a liquid
                        $scope.station.connectedLiquids[i]= {
                            "id":$scope.liquidSelection.id,
                            "amount":$scope.liquidSelection.amount,
                            "pressurized":$scope.liquidSelection.pressurized,
                            "valve":$scope.selectedValve
                        };
                    }
                    else {
                        // this is a new liquid
                        $scope.station.connectedLiquids.push({
                            "id":$scope.liquidSelection.id,
                            "amount":$scope.liquidSelection.amount,
                            "pressurized":$scope.liquidSelection.pressurized,
                            "valve":$scope.selectedValve
                        });
                    }
                    updateStation();
                }
                else if ($scope.editOnHandLiquidIndex != null) {
                    // we're adding an on-hand liquid
                    $scope.station.onHandLiquids.push($scope.liquidSelection.id);
                    updateStation();
                }
            }
        }

        $scope.cancelLiquid = function() {
            if($scope.selectedValve != null && $scope.editOnHandLiquidIndex == null) {
                // this is a connectedLiquid being selected, we need to delete it
                $scope.deleteConnectedLiquid($scope.selectedValve-1);
            }
            // else it's an onHandLiquid and was already deleted, so just update
            else updateStation();
        }

        $scope.editConnectedLiquid = function(index) {
            // make sure we're not already editing
            if($scope.editOnHandLiquidIndex == null && $scope.selectedValve == null) {
                $scope.selectedValve = index+1;
                if($scope.liquidDisplay.connectedLiquids[index].id) {
                    $scope.liquidSelection = {
                        "id": $scope.liquidDisplay.connectedLiquids[index].id._id,
                        "type" :$scope.liquidDisplay.connectedLiquids[index].id.type,
                        "subtype": $scope.liquidDisplay.connectedLiquids[index].id.subtype,
                        "brand": $scope.liquidDisplay.connectedLiquids[index].id.brand,
                        "description": $scope.liquidDisplay.connectedLiquids[index].id.description,
                        "amount": $scope.liquidDisplay.connectedLiquids[index].amount,
                        "pressurized": $scope.liquidDisplay.connectedLiquids[index].pressurized
                    }
                }
                querySubtypes(); // query from subtypes on to update Options
            }
            else $scope.ingredientError = "Already Editing!";
        }

        $scope.deleteConnectedLiquid = function(index) {
            // find matching liquid in station from liquid display
            var i = -1;
            $scope.station.connectedLiquids.filter(function(liquid, cur_index, liquids){
                if(liquid.id) {
                    if(liquid.id.valve == $scope.selectedValve) {
                        i = cur_index;
                        return true;
                    } else return false;
                } else return false;
            });
            // If found, remove from array
            if(i > -1) $scope.station.connectedLiquids.splice(i,1);
            updateStation(); // query from subtypes on to update Options
        }

        $scope.editOnHandLiquid = function(index) {
            // make sure we're not already editing
            if($scope.editOnHandLiquidIndex == null && $scope.selectedValve == null) {
                // set the selected index
                $scope.editOnHandLiquidIndex = index;
                // set the liquidSelection to the previous values
                $scope.liquidSelection = {
                    "id": $scope.liquidDisplay.onHandLiquids[index]._id,
                    "type": $scope.liquidDisplay.onHandLiquids[index].type,
                    "subtype": $scope.liquidDisplay.onHandLiquids[index].subtype,
                    "brand": $scope.liquidDisplay.onHandLiquids[index].brand,
                    "description": $scope.liquidDisplay.onHandLiquids[index].description,
                    "amount": null,
                    "pressurized": null
                }
                // delete the selected liquid from the station and display
                delete $scope.liquidDisplay.onHandLiquids[index];
                $scope.station.onHandLiquids.splice(index,1);
                querySubtypes();
            }
            else $scope.ingredientError = "Already Editing!";
        }

        $scope.deleteOnHandLiquid = function(index) {
            // find matching liquid in station from liquid display
            var i = $scope.station.onHandLiquids.indexOf($scope.liquidDisplay.onHandLiquids[index]);
            // If found, remove from array
            if(i > -1) $scope.station.onHandLiquids.splice(i,1);
            updateStation();
        }

        $scope.addOnHandLiquid = function() {
            $scope.editOnHandLiquidIndex = $scope.station.onHandLiquids.length;
        }

        function updateStation(){
            var stationPromise = stationService.updateStation($scope.station);
            stationPromise.then(function (station) {
                $scope.station = station;
                updateLiquidDisplay();
                $scope.selectedValve = null;
                $scope.editOnHandLiquidIndex = null;
                $scope.liquidSelection = {"subtypes": [], "brands": [], "descriptions": [], "amounts": [],
                                            "id":null, "type":null, "subtype":null, "brand":null,"description":null,
                                            "amount": null, "pressurized": false};
                $scope.messageSuccess = "Station Updated!"
            });
        }

        function updateLiquidDisplay() {
            $scope.liquidDisplay = {"connectedLiquids":[],"onHandLiquids":[]};
            // iterate through all valves for station
            for(i=0; i<$scope.station.numValves; i++) {
                // add place holders
                $scope.liquidDisplay.connectedLiquids[i] =
                    {"valve":i+1,
                    "id":{"_id": null, "type":null, "subtype":null, "brand":null,"description":null},
                    "amount":null,"pressurized":false};
            }
            for(i=0 ;i<$scope.station.connectedLiquids.length; i++) {
                // Liquid exists, copy info to the correct display index (by valve)
                var index = $scope.station.connectedLiquids[i].valve-1;
                $scope.liquidDisplay.connectedLiquids[index] = $scope.station.connectedLiquids[i];
            }
            $scope.liquidDisplay.onHandLiquids = $scope.station.onHandLiquids;
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
            if ($scope.liquidSelection.type != null) {
                var promise = typeService.getSubtypes($scope.liquidSelection.type);
                promise.then(function (subtypes) {
                    // we want to force a full liquid specification in the station so
                    // remove all cases of "*Any"
                    $scope.liquidSelection.subtypes = subtypes.filter(function(st){
                        return st.subtype != "*Any";
                    });
                    queryBrands();
                });
            }
        }

        function queryBrands() {
            if ($scope.liquidSelection.subtype != null) {
                // query for liquids of selected type and subtype, buy none with *Any
                var query = {
                    "type" : $scope.liquidSelection.type,
                    "subtype" :$scope.liquidSelection.subtype,
                    "brand":{$ne:"*Any"}
                };
                var promise = liquidService.getLiquids(query);
                promise.then(function (brands) {
                    // remove duplicate Brands
                    // http://stackoverflow.com/a/31963129
                    var reducedBrands =
                    $scope.liquidSelection.brands = brands.reduceRight(function (r, a) {
                        r.some(function (b) { return a.brand === b.brand; }) || r.push(a);
                        return r;
                    }, []);

                    queryDescriptions();
                });
            }
        }

        function queryDescriptions() {
            if ($scope.liquidSelection.brand != null) {
                // get all Descriptions from that Type and Subtype and Brand
                var query = {
                    "type" : $scope.liquidSelection.type,
                    "subtype" : $scope.liquidSelection.subtype,
                    "brand" : $scope.liquidSelection.brand
                };
                var promise = liquidService.getLiquids(query);
                promise.then(function (descriptions) {
                    $scope.liquidSelection.descriptions = descriptions;
                    queryBottles();
                });
            }
        }

        function queryBottles() {
            if($scope.liquidSelection.description != null
            && $scope.liquidSelection.id != null) {
                // liquidService.getBottle($scope.liquidSelection.id,
                //                         $scope.liquidSelection.amount);
            }
        }

        function updateDisplayFromSelection() {
            if($scope.selectedValve != null && $scope.editOnHandLiquidIndex == null) {
                // this is a connectedLiquid being selected, we don't update for onHandLiquids
                $scope.liquidDisplay.connectedLiquids[$scope.selectedValve-1] = {
                    "id":{"_id":$scope.liquidSelection.id,
                            "type":$scope.liquidSelection.type,
                            "subtype":$scope.liquidSelection.subtype,
                            "brand":$scope.liquidSelection.brand,
                            "description":$scope.liquidSelection.description
                        },
                    "amount":$scope.liquidSelection.amount,
                    "pressurized":$scope.liquidSelection.pressurized,
                    "valve":$scope.selectedValve
                }
            }
        }
}]);
