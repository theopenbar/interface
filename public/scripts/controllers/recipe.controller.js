// http://www.shanidkv.com/blog/angularjs-adding-form-fields-dynamically
app.controller('RecipeCtrl', ['$scope', 'typeService', 'liquidService', 'recipeService',
    function($scope, typeService, liquidService, recipeService) {

        function defaultValues() {
            // stores full recipe
            $scope.recipe = {name: null, liquids: [], garnishes: []};

            // stores actual selections
            $scope.liquidSelection = {"subtypes": null, "brands": null, "descriptions": null,
                                        "type": null, "subtype": null, "brand": null,
                                        "amount": null, "requirement": true};

            // store the index of the liquid you're currently editing
            // and index of null means you're not in "edit" mode
            $scope.liquidIndex = null;
            $scope.liquidDisplay = null;

            // same idea for garnish
            $scope.garnishIndex = null;
            $scope.garnishDisplay = null;
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
                default:
                    delete $scope.recipe.liquids[$scope.liquidIndex].id;

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
                    $scope.recipe.liquids[$scope.liquidIndex].id = brands.filter(function(v) {
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
                 $scope.recipe.liquids[$scope.liquidIndex].id = $scope.liquidSelection.brands.filter(function(v) {
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


        // set up default values
        defaultValues();

        // get all Types on page load
        var promise = typeService.getTypes();
        promise.then(function (types) {
            $scope.types = types;
        });

        $scope.addLiquid = function(){
            $scope.recipe.liquids.push({"id": null, "amount": null, "requirement": true});
            $scope.liquidIndex = $scope.recipe.liquids.length-1;
        };

        $scope.addGarnish = function(){
            $scope.recipe.garnishes.push({"name": null, "amount": null});
            $scope.garnishIndex = $scope.recipe.garnishes.length-1;
        };

        $scope.submitRecipe = function() {
            // save to database
            recipeService.saveRecipe($scope.recipe).then(function (status) {
                if(status) {
                    $scope.messageSuccess = "Recipe saved successfully.";
                    // clear to start a new recipe
                    defaultValues();
                }
            });
        };

        $scope.selectType = function() {
            // erase all values afterwards
            deleteFutureChoices("subtype");

            // get all Subtypes from that Type
            querySubtypes();
        }

        $scope.selectSubtype = function() {
            // erase all values afterwards
            deleteFutureChoices("brand");

            // query for liquids from the Type and Subtype
            queryBrands();
        }

        $scope.selectBrand = function() {
            // erase all values afterwards
            deleteFutureChoices("description");

            // query for descriptions from the Type, Subtype, and Brand
            queryDescriptions();
        }

        $scope.selectDescription = function() {
            // last liquid option, so get id of liquid and set it in recipe
             $scope.recipe.liquids[$scope.liquidIndex].id = $scope.liquidSelection.descriptions.filter(function(v) {
                    return v.description === $scope.liquidSelection.description;
            })[0]._id;
        }

        $scope.addLiquidToRecipe = function() {
            // check that liquid is fully filled in
            $scope.recipe.liquids[$scope.liquidIndex].type = $scope.liquidSelection.type;
            $scope.recipe.liquids[$scope.liquidIndex].subtype = $scope.liquidSelection.subtype;
            if ($scope.liquidSelection.subtype != "*Any") {
                $scope.recipe.liquids[$scope.liquidIndex].brand = $scope.liquidSelection.brand;
                if ($scope.liquidSelection.brand != "*Any")
                    $scope.recipe.liquids[$scope.liquidIndex].description = $scope.liquidSelection.description;
            }
            $scope.recipe.liquids[$scope.liquidIndex].amount = $scope.liquidSelection.amount;
            $scope.recipe.liquids[$scope.liquidIndex].requirement = $scope.liquidSelection.requirement;

            var liquid = $scope.recipe.liquids[$scope.liquidIndex];
            for (var member in liquid) {
                if (liquid[member] == null) {
                    $scope.ingredientError = "Please fill in all forms for this liquid.";
                    // return an error
                    return false;
                }
            }
            // otherwise good, clear error if there
            $scope.ingredientError = null;

            // reset selections for next liquid
            $scope.liquidSelection = {"subtypes": null, "brands": null, "descriptions": null,
                                        "type": null, "subtype": null, "brand": null,
                                        "amount": null, "requirement": true};
            // display this liquid in the Recipe pane
            $scope.liquidDisplay++;

            // stop displaying liquid edit GUI
            $scope.liquidIndex = null;
        }

        $scope.addGarnishToRecipe = function() {
            // check that garnish is fully filled in
            var garnish = $scope.recipe.garnishes[$scope.garnishIndex];
            for (var member in garnish) {
                if (garnish[member] == null) {
                    $scope.ingredientError = "Please fill in all forms for this garnish.";
                    // return an error
                    return false;
                }
            }
            // otherwise good, clear error if there
            $scope.ingredientError = null;

            // display this garnish in the Recipe pane
            $scope.garnishDisplay++;

            // stop displaying garnish edit GUI
            $scope.garnishIndex = null;
        }

        $scope.editLiquid = function(index) {
            $scope.liquidIndex = index;
            $scope.liquidSelection = $scope.recipe.liquids[index];
            querySubtypes();
            queryBrands();
            queryDescriptions();
        }

        $scope.editGarnish = function(index) {
            $scope.garnishIndex = index;
        }
}]);
