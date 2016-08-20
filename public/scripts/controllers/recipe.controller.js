// http://www.shanidkv.com/blog/angularjs-adding-form-fields-dynamically
app.controller('RecipeCtrl', ['$scope', '$compile', 'recipeService',
    function($scope, $compile, recipeService) {

        $scope.drinks = [];
        $scope.garnishes = [];

        $scope.addDrink = function(){
            var newDrinkNum = $scope.drinks.length+1;
            $scope.drinks.push({'id':'drink'+newDrinkNum});
        };

        $scope.addGarnish = function(){
            var newGarnishNum = $scope.garnishes.length+1;
            $scope.garnishes.push({'id':'garnish'+newGarnishNum});
        };

        $scope.saveRecipe = function() {
            // send it to database
        };
}]);
