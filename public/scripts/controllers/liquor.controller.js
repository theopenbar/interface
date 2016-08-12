app.controller('LiquorCtrl', ['$scope', 'liquorService',
    function($scope, liquorService){

        // get all Types on page load
        var promise = liquorService.getTypes();
        promise.then(function (types) {
            $scope.types = types;
        });

        // fill up with null to check against
        $scope.ingredient = {type: null, brand: null, description: null, amount: null, barcode: null};

        $scope.getBrands = function() {
            console.log("selected a type:", $scope.ingredient.type);
            // get all Brands from that Type
            var promise = liquorService.getBrands($scope.ingredient.type);
            promise.then(function (brands) {
                $scope.brands = brands;
            });
        }

        // save the Ingredient
        $scope.saveIngredient = function() {
            var ingredient = $scope.ingredient;

            // check that each form is filled in
            for (var member in ingredient) {
                if (ingredient[member] == null) {
                    $scope.messageError = "Please fill in all forms.";
                    $scope.messageSuccess = null;
                    // return an error
                    return false;
                }
            }

            // OK to save to database
            liquorService.saveIngredient(ingredient).then(function (types) {
                if(types) {
                    $scope.messageError = null;
                    $scope.messageSuccess = "Ingredient saved successfully.";
                    $scope.ingredient = {type: null, brand: null, description: null, amount: null, barcode: null};
                }
            });
        };
}]);
