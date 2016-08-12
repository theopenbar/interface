app.controller('LiquorCtrl', ['$scope', 'liquorService',
    function($scope, liquorService){

        // get all Types on page load
        var promise = liquorService.getTypes();
        promise.then(function (types) {
            $scope.types = types;
        });

        // fill up with null to check against
        $scope.ingredient = {type: null, brand: null, description: null, amount: null, barcode: null};

        // save the Ingredient
        $scope.saveIngredient = function() {
            var ingredient = $scope.ingredient;

            // check that each form is filled in
            for (var member in ingredient) {
                if (ingredient[member] == null) {
                    // return an error
                    return false;
                }
            }

            // OK to save to database
            liquorService.saveIngredient(ingredient);
        };
}]);
