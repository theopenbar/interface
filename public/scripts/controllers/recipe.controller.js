// http://www.shanidkv.com/blog/angularjs-adding-form-fields-dynamically
app.controller('RecipeCtrl', ['$scope', 'typeService', 'liquidService', 'recipeService',
    function($scope, typeService, liquidService, recipeService) {

        // get all Types on page load
        var promise = typeService.getTypes();
        promise.then(function (types) {
            $scope.types = types;
        });

        $scope.recipe = {name: null, drinks: [], garnishes: []};

        $scope.addDrink = function(){
            var newDrinkNum = $scope.recipe.drinks.length+1;
            $scope.recipe.drinks.push(
                {'id':newDrinkNum, type: null, subtype: null, brand: null, description: null, amount: null, requirement: true}
            );
        };

        $scope.addGarnish = function(){
            var newGarnishNum = $scope.recipe.garnishes.length+1;
            $scope.recipe.garnishes.push(
                {'id':newGarnishNum, name: null, amount: null}
            );
        };

        $scope.saveRecipe = function() {
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

        $scope.getSubtypes = function(drinkId) {
            // get selected type from Drink id
            // http://stackoverflow.com/a/7364203
            var type = $scope.recipe.drinks.filter(function(v) {
                return v.id === drinkId; // Filter out the appropriate one
            })[0].type; // Get result and access the type property

            // get all Subtypes from that Type
            var promise = typeService.getSubtypes(type);
            promise.then(function (subtypes) {
                $scope.subtypes = subtypes;
            });
        }

        $scope.getBrands = function(drinkId) {
             // get selected drink from Drink id
            // http://stackoverflow.com/a/7364203
            var drink = $scope.recipe.drinks.filter(function(v) {
                return v.id === drinkId; // Filter out the appropriate one
            })[0];

            // get all Brands from that Type and Subtype
            var query = {"type":drink.type, "subtype":drink.subtype};
            var promise = liquidService.getBrands(query);
            promise.then(function (brands) {
                $scope.brands = brands;
            });
        }

        $scope.getDescription = function(drinkId) {
             // get selected drink from Drink id
            // http://stackoverflow.com/a/7364203
            var drink = $scope.recipe.drinks.filter(function(v) {
                return v.id === drinkId; // Filter out the appropriate one
            })[0];

            // get all Descriptions from that Type and Subtype and Brand
            var query = {"type":drink.type, "subtype":drink.subtype, "brand":drink.brand};
            var promise = liquidService.getDescriptions(query);
            promise.then(function (descriptions) {
                $scope.descriptions = descriptions;
            });
        }
}]);
