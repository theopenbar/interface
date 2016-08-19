var app = angular.module('interface', ['ngResource', 'ui.router', 'ngStorage']);

app.run(function ($rootScope, $state, $location, AuthService) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromParams) {
        AuthService.getUserStatus()
            .then(function(){
                if (toState.access.restricted && !AuthService.isLoggedIn()) {
                    $location.path('/login');
                }
            })
    });
});

// https://scotch.io/tutorials/angular-routing-using-ui-router
app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'partials/home.html',
            controller: 'homeController',
            access: {restricted: false}
        })
        .state('register', {
            url: '/register',
            templateUrl: 'partials/register.html',
            controller: 'registerController',
            access: {restricted: false}
        })
        .state('login', {
            url: '/login',
            templateUrl: 'partials/login.html',
            controller: 'loginController',
            access: {restricted: false}
        })
        .state('logout', {
            url: '/logout',
            controller: 'logoutController',
            access: {restricted: true}
        })
        .state('drinks', {
            url: '/drinks',
            templateUrl: 'partials/drinks.html',
            controller: 'DrinksCtrl',
            access: {restricted: false}
        })
        .state('liquor', {
            url: '/liquor',
            templateUrl: 'partials/liquor.html',
            controller: 'LiquorCtrl',
            access: {restricted: false}
        })
        .state('create-recipe', {
            url: '/create-recipe',
            templateUrl: 'partials/create-recipe.html',
            controller: 'RecipeCtrl',
            access: {restricted: true}
        })
        .state('pour', {
            url: '/pour',
            templateUrl: 'partials/pour.html',
            controller: 'PourCtrl',
            access: {restricted: false}
        })
        .state('queuer', {
            url: '/queuer',
            templateUrl: 'partials/queuer.html',
            controller: 'QueueRCtrl',
            access: {restricted: true}
        })
        .state('station', {
            url: '/station',
            templateUrl: 'partials/station.html',
            controller: 'StationCtrl',
            access: {restricted: false}
        })
        .state('select-station', {
            url: '/select-station',
            templateUrl: 'partials/select-station.html',
            controller: 'SelectStationCtrl',
            access: {restricted: false}
        })

        // https://scotch.io/tutorials/pretty-urls-in-angularjs-removing-the-hashtag
        // use the HTML5 History API
        $locationProvider.html5Mode(true);
});
