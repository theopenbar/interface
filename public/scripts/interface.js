var app = angular.module('interface', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);
