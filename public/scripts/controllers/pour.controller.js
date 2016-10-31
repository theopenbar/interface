app.controller('PourCtrl', ['$scope', '$localStorage', '$location', '$anchorScroll', '$q',
               'stationService', 'liquidService', 'WebSocket',
    function($scope, $localStorage, $location, $anchorScroll, $q, stationService,
        liquidService, WebSocket){

        $scope.recipes = [];
        $scope.WebSocket = WebSocket;


        // tries to find the station ID,
        // and if it is there, query the database for it
        if (stationService.findStationOnPage() == true) {
            var stationPromise = stationService.getStation($localStorage.stationId);
            stationPromise.then(function(station) {
                $scope.station = station;
                getAllRecipes();
            });
        }
        // if it's not there, findStationOnPage will redirect to /select-station

        // display the list of ingredients
        // so that the user can pour the drink
        $scope.selectRecipe = function(recipe) {
            // only allow user to select a new drink if the previous one is done pouring
            // !pourInProgress is true while NOT pouring
            // pourComplete is true afterwards
            if (!WebSocket.pourInProgress() || WebSocket.pourComplete()) {
                // dismiss old status in case user didn't hit close first
                WebSocket.dismissPourStatus();

                // select drink and display ingredients
                $scope.recipeSelected = recipe;
                $scope.listIngredients = true;

                // clear out old messages from previous pour
                WebSocket.messages.length = 0;

                // need timeout so it runs after DOM is updated to show 'recipe'
                // http://stackoverflow.com/a/19889541
                setTimeout(function() {
                    $location.hash('recipe');
                    $anchorScroll();
                }, 0);
            }
            else {
                alert("Please wait until pour is complete to select another drink")
            }
        };

        $scope.pourDrink = function(recipe) {
            // tell the station to pour the drink
            WebSocket.sendCommand($localStorage.stationId, '01', recipe._id);

            // hide recipe after we start pouring
            $scope.listIngredients = false;
        };

        function getAllRecipes() {
            var query = {"name":{$exists: true}};
            var recipePromise = stationService.getRecipes($scope.station, query);
            recipePromise.then(function (recipes) {
                $scope.recipes = recipes;
            });
        }
}]);
