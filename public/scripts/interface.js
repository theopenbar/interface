var app = angular.module('interface', ['ngResource', 'ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        })
        .when('/add-drink', {
            templateUrl: 'partials/drink-form.html',
            controller: 'AddDrinkCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

app.controller('HomeCtrl', ['$scope', '$resource',
    function($scope, $resource){
        var Drinks = $resource('/api/drinks');
        Drinks.query(function(drinks){
            $scope.drinks = drinks;
        });
}]);

app.controller('AddDrinkCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location) {
        $scope.save = function() {
            var Drinks = $resource)'/api/drinks');
            Drinks.save($scope.drink, function() {
                $location.path('/');
            });
        };
)]);
