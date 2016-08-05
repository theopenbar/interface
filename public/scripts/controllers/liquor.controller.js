app.controller('LiquorCtrl', ['$scope', 'liquorService',
    function($scope, liquorService){
        var promise = liquorService.getTypes();
        promise.then(function (liquors) {
            $scope.liquors = liquors;
        });
}]);
