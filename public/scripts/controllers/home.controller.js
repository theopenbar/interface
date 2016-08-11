app.controller('homeController', ['$scope', '$location', 'AuthService',
    function ($scope, $location, AuthService) {
        AuthService.getUserStatus()
            .then(function(){
                    $scope.loggedIn = AuthService.isLoggedIn();
            })
}]);