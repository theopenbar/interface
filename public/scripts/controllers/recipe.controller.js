// http://www.shanidkv.com/blog/angularjs-adding-form-fields-dynamically
app.controller('RecipeCtrl', ['$scope', 'typeService', 'liquidService', 'recipeService',
    function($scope, typeService, liquidService, recipeService) {

        // get all Types on page load
        var promise = typeService.getTypes();
        promise.then(function (types) {
            $scope.types = types;
        });

        // stores full recipe
        $scope.recipe = {name: null, liquids: [], garnishes: []};

        // stores actual selections
        $scope.liquidSelection = {"subtypes": null, "brands": null, "descriptions": null};

        // a fresh, blank liquid
        $scope.liquid = null;

        // a fresh, blank garnish
        $scope.garnishEdit = null;

        $scope.addLiquid = function(){
            // construct with the bare necessities
            $scope.liquid = {"id": null, "amount": null, "requirement": true};//, "text": null};
        };

        $scope.addGarnish = function(){
            $scope.garnishEdit = {"name": null, "amount": true};
        };

        $scope.submitRecipe = function() {
            // check that each form is filled in
            var recipe = $scope.recipe;

            // check that name is not blank
            if (recipe.name == null || recipe.name == "") {
                $scope.messageError = "Please enter a name for this recipe.";
                $scope.messageSuccess = null;
                return false;
            }

            // check that there is at least one ingredient
            if (recipe.drinks.length == 0) {
                $scope.messageError = "Please add at least one drink.";
                $scope.messageSuccess = null;
                // return an error
                return false;
            }

            // check that all garnishes are fully filled in
            for (var garnish in recipe.garnishes) {
                // for each garnish
                var garnish = recipe.garnishes[garnish];
                for (var member in garnish) {
                    if (garnish[member] == null) {
                        $scope.messageError = "Please fill in all forms for "+garnish.id+".";
                        $scope.messageSuccess = null;
                        // return an error
                        return false;
                    }
                }
            }

            // OK to save to database
            recipeService.saveRecipe(recipe).then(function (status) {
                if(status) {
                    $scope.messageError = null;
                    $scope.messageSuccess = "Recipe saved successfully.";
                    // clear to start a new recipe
                    $scope.recipe = {name: null, drinks: [], garnishes: []};
                }
            });
        };

        $scope.getSubtypes = function(type) {
            // set selection
            $scope.liquid.type = type;
            // erase all values afterwards
            $scope.liquidSelection.subtypes = null;
            $scope.liquidSelection.brands = null;
            $scope.liquidSelection.descriptions = null;
            $scope.liquid.id = null;
            // get all Subtypes from that Type
            var promise = typeService.getSubtypes(type);
            promise.then(function (subtypes) {
                $scope.liquidSelection.subtypes = subtypes;
            });
        }

        $scope.getBrands = function(subtype) {
            // set selection
            $scope.liquid.subtype = subtype;
            // erase all values afterwards
            $scope.liquidSelection.brands = null;
            $scope.liquidSelection.descriptions = null;
            $scope.liquid.id = null;
            if (subtype == "*Any") {
                // get ID for "brand" : "*Any"
                // http://stackoverflow.com/a/7364203
                $scope.liquid.id = $scope.liquidSelection.subtypes.filter(function(v) {
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
            $scope.liquid.brand = brand;
            // erase all values afterwards
            $scope.descriptions = null;
            $scope.liquid.id = null;
            if (brand == "*Any") {
                // get ID for "brand" : "*Any"
                // http://stackoverflow.com/a/7364203
                $scope.liquid.id = $scope.liquidSelection.brands.filter(function(v) {
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
            $scope.liquid.description = description;
            $scope.liquid.id = $scope.liquidSelection.descriptions.filter(function(v) {
                    return v.description === description;
            })[0]._id;
        }

        $scope.addLiquidToRecipe = function() {
            // create a user-friendly display of the liquid
            //$scope.createText();

            for (var member in $scope.liquid) {
                if ($scope.liquid[member] == null) {
                    $scope.messageError = "Please fill in all forms for this liquid.";
                    $scope.messageSuccess = null;
                    // return an error
                    return false;
                }
            }

            $scope.recipe.liquids.push($scope.liquid);
        }

        /*$scope.createText = function() {
            // handle how descriptive the text needs to be
            if ($scope.liquid.subtype == "*Any") {
                $scope.liquid.text = $scope.liquid.amount+"oz of any type of "+$scope.liquid.type;
            }
            else if ($scope.liquid.brand == "*Any") {
                $scope.liquid.text = $scope.liquid.amount+"oz of any type of "+$scope.liquid.subtype+" "+$scope.liquid.type;
            }
            else {
                $scope.liquid.text = $scope.liquid.amount+"oz of "+$scope.liquid.brand+" "+$scope.liquid.description+" "+$scope.liquid.subtype+" "+$scope.liquid.type;
            }

            // handle "requirement" checkmark
            if ($scope.liquid.requirement) {
                $scope.liquid.text += " (requirement)"
            }
            else {
                $scope.liquid.text += " (optional)"
            }
        }*/
}]);
