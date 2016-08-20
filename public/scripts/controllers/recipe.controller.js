// http://www.shanidkv.com/blog/angularjs-adding-form-fields-dynamically
app.controller('RecipeCtrl', ['$scope', '$compile', 'recipeService',
    function($scope, $compile, recipeService) {

        $scope.recipe = {name: null, drinks: [], garnishes: []};

        $scope.addDrink = function(){
            var newDrinkNum = $scope.recipe.drinks.length+1;
            $scope.recipe.drinks.push(
                {'id':'Drink '+newDrinkNum, type: null, brand: null, description: null, amount: null, requirement: null}
            );
        };

        $scope.addGarnish = function(){
            var newGarnishNum = $scope.recipe.garnishes.length+1;
            $scope.recipe.garnishes.push(
                {'id':'Garnish '+newGarnishNum, name: null, amount: null}
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
}]);
