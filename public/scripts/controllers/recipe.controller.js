// http://www.shanidkv.com/blog/angularjs-adding-form-fields-dynamically
app.controller('RecipeCtrl', ['$scope', 'typeService', 'liquidService', 'recipeService',
    function($scope, typeService, liquidService, recipeService) {

        function defaultValues() {
            // stores full recipe
            $scope.recipe = {name: null, liquids: [], garnishes: []};

            // stores actual selections
            $scope.liquidSelection = {"subtypes": null, "brands": null, "descriptions": null};

            // store the index of the liquid you're currently editing
            // and index of null means you're not in "edit" mode
            $scope.liquidIndex = null;
            $scope.liquidDisplay = null;

            // same idea for garnish
            $scope.garnishIndex = null;
            $scope.garnishDisplay = null;
        }

        // get all Types on page load
        var promise = typeService.getTypes();
        promise.then(function (types) {
            $scope.types = types;
        });

        // set up default values
        defaultValues();

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

        $scope.getSubtypes = function(type) {
            // set selection
             $scope.recipe.liquids[$scope.liquidIndex].type = type;
            // erase all values afterwards
            $scope.liquidSelection.subtypes = null;
            $scope.liquidSelection.brands = null;
            $scope.liquidSelection.descriptions = null;
            $scope.recipe.liquids[$scope.liquidIndex].id = null;
            // get all Subtypes from that Type
            var promise = typeService.getSubtypes(type);
            promise.then(function (subtypes) {
                $scope.liquidSelection.subtypes = subtypes;
            });
        }

        $scope.getBrands = function(subtype) {
            // set selection
             $scope.recipe.liquids[$scope.liquidIndex].subtype = subtype;
            // erase all values afterwards
            $scope.liquidSelection.brands = null;
            $scope.liquidSelection.descriptions = null;
             $scope.recipe.liquids[$scope.liquidIndex].id = null;
            if (subtype == "*Any") {
                // get ID for "brand" : "*Any"
                // http://stackoverflow.com/a/7364203
                 $scope.recipe.liquids[$scope.liquidIndex].id = $scope.liquidSelection.subtypes.filter(function(v) {
                    return v.brand === "*Any"; // Filter out the appropriate one
                })[0]._id;
            }
            else {
                // get all Brands from that Type and Subtype
                var query = {"type":$scope.type, "subtype":subtype};
                var promise = liquidService.getBrands(query);
                promise.then(function (brands) {
                    $scope.liquidSelection.brands = brands;
                });
            }
        }

        $scope.getDescription = function(brand) {
            // set selection
             $scope.recipe.liquids[$scope.liquidIndex].brand = brand;
            // erase all values afterwards
            $scope.descriptions = null;
             $scope.recipe.liquids[$scope.liquidIndex].id = null;
            if (brand == "*Any") {
                // get ID for "brand" : "*Any"
                // http://stackoverflow.com/a/7364203
                 $scope.recipe.liquids[$scope.liquidIndex].id = $scope.liquidSelection.brands.filter(function(v) {
                    return v.brand === "*Any"; // Filter out the appropriate one
                })[0]._id;
            }
            else {
                // get all Descriptions from that Type and Subtype and Brand
                var query = {"type":$scope.type, "subtype":$scope.subtype, "brand":brand};
                var promise = liquidService.getDescriptions(query);
                promise.then(function (descriptions) {
                    $scope.liquidSelection.descriptions = descriptions;
                });
            }
        }

        $scope.chooseDescription = function(description) {
            // set selection
             $scope.recipe.liquids[$scope.liquidIndex].description = description;
             $scope.recipe.liquids[$scope.liquidIndex].id = $scope.liquidSelection.descriptions.filter(function(v) {
                    return v.description === description;
            })[0]._id;
        }

        $scope.addLiquidToRecipe = function() {
            // check that liquid is fully filled in
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
            $scope.liquidSelection = {"subtypes": null, "brands": null, "descriptions": null};

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
}]);
