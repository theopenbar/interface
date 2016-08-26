app.controller('LiquidCtrl', ['$scope', 'typeService', 'liquidService',
    function($scope, typeService, liquidService){

        // get all Types on page load
        var promise = typeService.getTypes();
        promise.then(function (types) {
            $scope.types = types;
        });

        // remove "*Any" as an option, because you need to pick a specific liquid
        // http://stackoverflow.com/a/6310763
        function findAndRemove(array, property, value) {
            array.forEach(function(result, index) {
                if(result[property] === value) {
                    //Remove from array
                    array.splice(index, 1);
                }
            });
        }

        $scope.getSubtypes = function() {
            // get all Subtypes from that Type
            var promise = typeService.getSubtypes($scope.ingredient.type);
            promise.then(function (subtypes) {
                findAndRemove(subtypes, "subtype", "*Any");
                $scope.subtypes = subtypes;
            });
        }

        $scope.getBrands = function() {
            // get all Brands from that Type and Subtype
            var query = {"type":$scope.ingredient.type, "subtype":$scope.ingredient.subtype};
            var promise = liquidService.getBrands(query);
            promise.then(function (brands) {
                findAndRemove(brands, "brand", "*Any");
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
