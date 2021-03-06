app.controller('LiquidCtrl', ['$scope', 'typeService', 'liquidService',
    function($scope, typeService, liquidService){

    function defaultValues() {
        // make a default object so we can tell when it's all filled in
        $scope.liquid = {type: null, subtype: null, brand: null, description: null};

        // stores actual selections
        $scope.liquidSelection = {"types": null, "subtypes": null, "brands": null};
    }

    function deleteFutureChoices(state) {
        // erase all values after the current state
        switch (state) {
            // no "break" because you always want it to fall through
            case "subtype":
                $scope.liquid.subtype = null;
                $scope.liquidSelection.subtypes = null;
            case "brand":
                $scope.liquid.brand = null;
                $scope.liquidSelection.brands = null;
            default:
                // always reset description on change
                $scope.liquid.description = null;
        }
    }

        // get all Types on page load
        var promise = typeService.getTypes();
        promise.then(function (types) {
            $scope.liquidSelection.types = types;
        });

        // set up default values
        defaultValues();

        // remove "*Any" as an option, because you need to pick a specific liquid
        // http://stackoverflow.com/a/6310763
        function findAndRemove(array, property, value) {
            array.forEach(function(result, index) {
                if(result[property] === value) {
                    //Remove from array
                    array.splice(index, 1);
                }
            });
        }

        $scope.getSubtypes = function() {
            // erase all values afterwards
            deleteFutureChoices("subtype");

            // get all Subtypes from that Type
            var promise = typeService.getSubtypes($scope.liquid.type);
            promise.then(function (subtypes) {
                findAndRemove(subtypes, "subtype", "*Any");
                $scope.liquidSelection.subtypes = subtypes;
            });
        }

        $scope.getBrands = function() {
            // erase all values afterwards
            deleteFutureChoices("brand");

            // get all Brands from that Type and Subtype
            var query = {
                "type" : $scope.liquid.type,
                "subtype" : $scope.liquid.subtype
            };
            var promise = liquidService.getLiquids(query);
            promise.then(function (brands) {
                findAndRemove(brands, "brand", "*Any");

                // remove duplicate Brands
                // http://stackoverflow.com/a/31963129
                $scope.liquidSelection.brands = brands.reduceRight(function (r, a) {
                    r.some(function (b) { return a.brand === b.brand; }) || r.push(a);
                    return r;
                }, []);
            });
        }

        // save the liquid
        $scope.saveLiquid = function() {
            var liquid = $scope.liquid;

            // check that each form is filled in
            for (var member in liquid) {
                if (liquid[member] == null || liquid[member] == "") {
                    $scope.messageError = "Please fill in all forms.";
                    $scope.messageSuccess = null;
                    // return an error
                    return false;
                }
            }

            // convert liquid amount from text to number
            //liquid.amount = Number(liquid.amount);

            // OK to save to database
            liquidService.saveLiquid(liquid).then(function (types) {
                if(types) {
                    $scope.messageError = null;
                    $scope.messageSuccess = "liquid saved successfully.";
                    //$scope.liquid = {type: null, subtype: null, brand: null, description: null, amount: null, barcode: null};
                    // forget about amount and barcode for now
                    $scope.liquid = {type: null, subtype: null, brand: null, description: null};
                }
            });
        };
}]);
