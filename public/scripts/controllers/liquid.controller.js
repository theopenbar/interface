app.controller('LiquidCtrl', ['$scope', 'typeService', 'liquidService',
    function($scope, typeService, liquidService){

    function defaultValues() {
        // make a default object so we can tell when it's all filled in
        $scope.liquid = {type: null, subtype: null, brand: null, description: null};
        // store ID of liquid if it already exists in the database
        $scope.liquidId = null;

        // create bottle for this liquid
        $scope.bottle = false;
        $scope.bottleId = null;

        // stores actual selections
        $scope.liquidSelection = {"types": null, "subtypes": null, "brands": null};

        // get all Types
        var promise = typeService.getTypes();
        promise.then(function (types) {
            $scope.liquidSelection.types = types;
        });
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
                // always reset description and ID on change
                $scope.liquid.description = null;
                $scope.liquidId = null;
        }
    }

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

    $scope.getDescriptions = function() {
        // erase all values afterwards
        deleteFutureChoices("description");

        // get all Descriptions from that Type, Subtype, Brand
        var query = {
            "type" : $scope.liquid.type,
            "subtype" : $scope.liquid.subtype,
            "brand" : $scope.liquid.brand
        };
        var promise = liquidService.getLiquids(query);
        promise.then(function (descriptions) {
            $scope.liquidSelection.descriptions = descriptions;
        });
    }

    $scope.getId = function() {
        // get ID for that Type, Subtype, Brand, Description
        var query = {
            "type" : $scope.liquid.type,
            "subtype" : $scope.liquid.subtype,
            "brand" : $scope.liquid.brand,
            "description" : $scope.liquid.description
        };
        var promise = liquidService.getLiquids(query);
        promise.then(function (liquid) {
            // set ID if correct liquid was returned
            if (liquid.length > 0) {
                $scope.liquidId = liquid[0]._id;
            }
            else $scope.liquidId = null;
        });
    }

    $scope.getBottleId = function() {
        //  get bottle ID for this Liquid and amount
        var query = {
            "liquid" : $scope.liquidId,
            "amount" : $scope.liquid.amount
        };
        var promise = liquidService.getBottles(query);
        promise.then(function(bottle) {
            if(bottle.length > 0) {
                $scope.bottleId = bottle[0]._id;
                $scope.liquid.barcode = bottle[0].barcode;
            }
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
        // if we're saving a bottle
        if ($scope.bottle == true) {
            if (liquid.amount == null || liquid.amount == "") {
                $scope.messageError = "Please fill in bottle amount.";
                $scope.messageSuccess = null;
                // return an error
                return false;
            }
            else if (liquid.barcode == null || liquid.barcode.length != 12) {
                $scope.messageError = "Please fill in bottle barcode. (12 Digits)";
                $scope.messageSuccess = null;
                // return an error
                return false;
            }
        }

        // check that liquid doesn't already exist
        if ($scope.liquidId != null && $scope.bottle == false) {
            $scope.messageError = "This liquid already exsists in the database.";
            $scope.messageSuccess = null;
            // return an error
            return false;
        }
        else if($scope.liquidId == null){
            liquidService.saveLiquid(liquid).then(function(returned){
                if($scope.bottle == false) {
                    $scope.messageSuccess = "Liquid Saved!";
                }
                else {
                    $scope.getId();
                }
            });
        }

        // check that bottle doesn't already exist if adding bottle
        if ($scope.bottle == true && $scope.bottleId != null) {
            $scope.messageError = "This bottle already exsists in the database. \
            If the barcode is wrong, please contact the database manager.";
            $scope.messageSuccess = null;
            // return an error
            return false;
        }
        else {
            attemptBottleSave(0);
        }
    };

    function attemptBottleSave(attempt) {
        var count = attempt + 1;
        if ($scope.liquidId == null) {
            if (count < 15) {
                setTimeout(function(){attemptBottleSave(count);},100);
            }
            else {
                $scope.messageError = "Timeout Waiting for Liquid ID, please try again.";
                $scope.messageSuccess = null;
            }
        }
        else {
            var bottle = {
                "liquid"    :$scope.liquidId,
                "amount"    :$scope.liquid.amount,
                "barcode"   :$scope.liquid.barcode
            }
            liquidService.saveBottle(bottle).then(function(returned){
                $scope.messageSuccess = "Liquid/Bottle Saved!";
                $scope.messageError = null;
                defaultValues();
            });
        }
    }
}]);
