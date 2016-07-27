app.service("stationService",
    function($localStorage, $resource, $location, $q) {

    // look for station in URL params
    var url_params = $location.search();
    var station_id = url_params.station;

    // if it's there, save it locally
    if (station_id != undefined) {
        $localStorage.stationId = station_id;
    }

    // get station from database only if it has been set
    if ($localStorage.stationId != undefined) {
        var deferred = $q.defer();

        this.getStation = function(station_id) {
            var Station = $resource('/api/station/:id', {id: station_id});
            Station.get(function(station){
                deferred.resolve(station);
            });

            return deferred.promise;
        };
    }

    this.saveIPAddress = function(station_id, host, port) {
        var Station =  $resource('/api/station/ip/:id', {id: station_id});
        Station.save({"host":host, "port":port});
    }
    
    this.saveNumValves = function(station_id, num_valves) {
        var Station =  $resource('/api/station/valves/:id', {id: station_id});
        Station.save({"num_valves":num_valves});
    }

    this.saveIngredient = function(station_id, ingredient) {
        var Station = $resource('/api/station/ingredient/:id', {id: station_id});
        Station.save(ingredient);
    };
});
