app.controller('HomeCtrl', ['$scope', 'drinksService',
    function($scope, drinksService){
        var promise = drinksService.getDrinks();
        promise.then(function (drinks) {
            $scope.drinks = drinks;
        });
}]);
