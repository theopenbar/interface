var app = angular.module('interface', ['ngResource', 'ui.router', 'ngStorage', 'ngWebSocket']);

// https://scotch.io/tutorials/angular-routing-using-ui-router
app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'partials/home.html'
        })
        .state('drinks', {
            url: '/drinks',
            templateUrl: 'partials/drinks.html',
            controller: 'DrinksCtrl'
        })
        .state('add-drink', {
            url: '/add-drink',
            templateUrl: 'partials/add-drink.html',
            controller: 'AddDrinkCtrl'
        })
        .state('pour', {
            url: '/pour',
            templateUrl: 'partials/pour.html',
            controller: 'PourCtrl'
        })
        .state('queuer', {
            url: '/queuer',
            templateUrl: 'partials/queuer.html',
            controller: 'QueueRCtrl'
        })
        .state('station', {
            url: '/station',
            templateUrl: 'partials/station.html',
            controller: 'StationCtrl'
        })

        // https://scotch.io/tutorials/pretty-urls-in-angularjs-removing-the-hashtag
        // use the HTML5 History API
        $locationProvider.html5Mode(true);
});
