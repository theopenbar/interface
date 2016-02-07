app.controller('AddDrinkCtrl', ['$scope', '$resource', 'drinksService',
    function($scope, $resource, drinksService) {
        $scope.save = function() {
            drinksService.saveDrink($scope.drink);
        };
}]);
