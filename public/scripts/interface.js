var app = angular.module('interface', ['ngResource', 'ngRoute', 'ngStorage']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html'
        })
        .when('/drinks', {
            templateUrl: 'partials/drinks.html',
            controller: 'DrinksCtrl'
        })
        .when('/add-drink', {
            templateUrl: 'partials/add-drink.html',
            controller: 'AddDrinkCtrl'
        })
        .when('/pour', {
            templateUrl: 'partials/pour.html',
            controller: 'PourCtrl',
        })
        .when('/queuer', {
            templateUrl: 'partials/queuer.html',
            controller: 'QueueRCtrl'
        })
        .when('/station', {
            templateUrl: 'partials/station.html',
            controller: 'StationCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

        // https://scotch.io/tutorials/pretty-urls-in-angularjs-removing-the-hashtag
        // use the HTML5 History API
        $locationProvider.html5Mode(true);
}]);
