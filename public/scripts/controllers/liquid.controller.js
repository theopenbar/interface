app.controller('LiquidCtrl', ['$scope', 'typeService', 'liquidService',
    function($scope, typeService, liquidService){

        // get all Types on page load
        var promise = typeService.getTypes();
        promise.then(function (types) {
            $scope.types = types;
        });

        // fill up with null to check against
        $scope.ingredient = {type: null, subtype: null, brand: null, description: null, amount: null, barcode: null};

        $scope.getSubtypes = function() {
            // get all Subtypes from that Type
            var promise = typeService.getSubtypes($scope.ingredient.type);
            promise.then(function (subtypes) {
                $scope.subtypes = subtypes;
            });
        }

        $scope.getBrands = function() {
            // get all Brands from that Type
            var promise = liquidService.getBrands($scope.ingredient.type);
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

            // convert ingredient amount from text to number
            ingredient.amount = Number(ingredient.amount);

            // OK to save to database
            liquidService.saveIngredient(ingredient).then(function (types) {
                if(types) {
                    $scope.messageError = null;
                    $scope.messageSuccess = "Ingredient saved successfully.";
                    $scope.ingredient = {type: null, subtype: null, brand: null, description: null, amount: null, barcode: null};
                }
            });
        };
}]);
