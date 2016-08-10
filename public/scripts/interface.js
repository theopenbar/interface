var app = angular.module('interface', ['ngResource', 'ui.router', 'ngStorage', 'ngWebSocket']);

// https://scotch.io/tutorials/angular-routing-using-ui-router
app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'partials/home.html'
        })
        .state('register', {
            url: '/register',
            templateUrl: 'partials/register.html'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'partials/login.html'
        })
        .state('logout', {
            url: '/logout',
            templateUrl: '/logout'
        })
        .state('drinks', {
            url: '/drinks',
            templateUrl: 'partials/drinks.html',
            controller: 'DrinksCtrl'
        })
        .state('liquor', {
            url: '/liquor',
            templateUrl: 'partials/liquor.html',
            controller: 'LiquorCtrl'
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
        .state('select-station', {
            url: '/select-station',
            templateUrl: 'partials/select-station.html',
            controller: 'SelectStationCtrl'
        })

        // https://scotch.io/tutorials/pretty-urls-in-angularjs-removing-the-hashtag
        // use the HTML5 History API
        $locationProvider.html5Mode(true);
});
