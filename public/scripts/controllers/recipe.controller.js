// http://www.shanidkv.com/blog/angularjs-adding-form-fields-dynamically
app.controller('RecipeCtrl', ['$scope', 'typeService', 'liquidService', 'recipeService',
    function($scope, typeService, liquidService, recipeService) {

        // get all Types on page load
        var promise = typeService.getTypes();
        promise.then(function (types) {
            $scope.types = types;
        });

        $scope.recipe = {name: null, liquids: [], garnishes: []};

        // a fresh, blank liquid
        $scope.liquidEdit = false;
        $scope.subtypes = false;
        $scope.brands = false;
        $scope.descriptions = false;

        // a fresh, blank garnish
        $scope.garnishEdit = false;

        $scope.addLiquid = function(){
            $scope.liquidEdit = {"id": null, "amount": null, "requirement": true};
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

            // check that all drinks are fully filled in
            for (var drink in recipe.drinks) {
                // for each drink
                var drink = recipe.drinks[drink];
                for (var member in drink) {
                    if (drink[member] == null) {
                        $scope.messageError = "Please fill in all forms for "+drink.id+".";
                        $scope.messageSuccess = null;
                        // return an error
                        return false;
                    }
                }
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
            // get all Subtypes from that Type
            var promise = typeService.getSubtypes(type);
            promise.then(function (subtypes) {
                $scope.subtypes = subtypes;
            });
        }

        $scope.getBrands = function(subtype) {
            // get all Brands from that Type and Subtype
            var query = {"type":$scope.type, "subtype":subtype};
            var promise = liquidService.getBrands(query);
            promise.then(function (brands) {
                $scope.brands = brands;
            });
        }

        $scope.getDescription = function(brand) {
            if (brand == "*Any") {
                // get ID for "brand" : "*Any"
                // http://stackoverflow.com/a/7364203
                $scope.liquidEdit.id = $scope.brands.filter(function(v) {
                    return v.brand === "*Any"; // Filter out the appropriate one
                })[0]._id;
            }
            else {
                // get all Descriptions from that Type and Subtype and Brand
                var query = {"type":$scope.type, "subtype":$scope.subtype, "brand":brand};
                var promise = liquidService.getDescriptions(query);
                promise.then(function (descriptions) {
                    $scope.descriptions = descriptions;
                });
            }
        }

        $scope.addLiquidToRecipe = function() {
            $scope.recipe.liquids.push($scope.liquidEdit);
        }
}]);
