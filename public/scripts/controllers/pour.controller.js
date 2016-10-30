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
                getRecipes();
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

        function getRecipes() {
            var recipePromise = stationService.getRecipes($scope.station);
            recipePromise.then(function (recipes) {
                console.log("Got Recipes");
                for(i=0; i<recipes.length; i++) {
                    console.log(recipes[i].name);
                    $scope.recipes[i] = recipes[i];
                    setLiquidsInfo();
                }
            });
        }

        function setLiquidsInfo() {
            var connectedPromises = [];
            var onHandPromises = [];
            for(i=0; i<$scope.station.connectedLiquids.length; i++) {
                connectedPromises[i] = liquidService.getLiquid($scope.station.connectedLiquids[i].id);
            }
            for(i=0; i<$scope.station.onHandLiquids.length; i++) {
                onHandPromises[i] = liquidService.getLiquid($scope.station.onHandLiquids[i].id);
            }
            $q.all(connectedPromises).then(function(liquids) {
                for(i=0;i<$scope.recipes.length;i++) {
                    for(j=0;j<$scope.recipes[i].liquids.length;j++) {
                        $scope.recipes[i].liquids[j].info =
                            liquids.find(function(liquid){
                                return liquid._id == $scope.recipes[i].liquids[j].id;
                            });
                    }
                }
            });
            $q.all(onHandPromises).then(function(liquids) {
                for(i=0;i<$scope.recipes.length;i++) {
                    for(j=0;j<$scope.recipes[i].liquids.length;j++) {
                        $scope.recipes[i].liquids[j].info =
                            liquids.find(function(liquid){
                                return liquid._id == $scope.recipes[i].liquids[j].id;
                            });
                    }
                }
            });
        }
}]);
