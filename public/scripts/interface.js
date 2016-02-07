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
        .when('/pour', {
            templateUrl: 'partials/pour.html',
            controller: 'PourCtrl'
        })
        .when('/queuer', {
            templateUrl: 'partials/queuer.html',
            controller: 'QueueRCtrl'
        })
        .when('/station', {
            templateUrl: 'partials/view-station.html',
            controller: 'ViewStationCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);
