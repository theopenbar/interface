// http://www.shanidkv.com/blog/angularjs-adding-form-fields-dynamically
app.controller('RecipeCtrl', ['$scope', '$compile', 'recipeService',
    function($scope, $compile, recipeService) {

        $scope.recipe = {"name": null};
        $scope.recipe.drinks = [];
        $scope.recipe.garnishes = [];

        $scope.addDrink = function(){
            var newDrinkNum = $scope.recipe.drinks.length+1;
            $scope.recipe.drinks.push({'id':'drink'+newDrinkNum});
        };

        $scope.addGarnish = function(){
            var newGarnishNum = $scope.recipe.garnishes.length+1;
            $scope.recipe.garnishes.push({'id':'garnish'+newGarnishNum});
        };

        $scope.saveRecipe = function() {
            // send it to database
        };
}]);
