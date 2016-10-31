app.service("stationService",
    function($resource, $q, $location, $localStorage, $rootScope, $state) {

    this.getStation = function(station_id) {
        var deferred = $q.defer();

        var Station = $resource('/api/station/:id', {id: station_id});
        Station.get(function(station){
            deferred.resolve(station);
        });
        return deferred.promise;
    }

    this.createStation = function() {
        var deferred = $q.defer();

        var Station = $resource('/api/station/', {}, {
          create: { method: 'POST' }
        });
        Station.create(function(station){
            deferred.resolve(station);
        });
        return deferred.promise;
    }

    this.updateStation = function(station) {
        var deferred = $q.defer();

        var Station = $resource('/api/station/:id', {id: station._id}, {
          update: { method: 'PUT' }
        });
        Station.update(station, function(station_updated){
            deferred.resolve(station_updated);
        });
        return deferred.promise;
    }

    this.findStationOnPage = function() {
        // look for station in URL params
        var url_params = $location.search();
        var station_id = url_params.station;

        // if it's in the URL param, make sure it's correct
        if (station_id != undefined) {
            // TODO: really should make sure it's correct
            // if it's there, save it locally
            $localStorage.stationId = station_id;
            // and remove the URL param
            $location.url($location.path());
        }
        // maybe it's in localStorage?
        if ($localStorage.stationId != undefined){
            return true;
        }
        // no station ID
        else {
            // store current state in rootScope so we can return to it later
            $rootScope.returnToState = $state.current.name;
            // go to select-station view
            $state.go('select-station');
            return false;
        }
    }

    this.getRecipes = function(station, query) {
        var deferred = $q.defer();

        var Recipes = $resource('/api/station/recipes/:id', {id:station._id}, {
            retrieve: { method:'PUT', isArray:true }
        });
        Recipes.retrieve(query, function(recipes){
            deferred.resolve(recipes);
        });

        return deferred.promise;
    }
});
