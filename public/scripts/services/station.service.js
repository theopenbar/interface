app.service("stationService",
    function($resource, $q) {

    this.getStation = function(station_id) {
        var deferred = $q.defer();

        var Station = $resource('/api/station/:id', {id: station_id});
        Station.get(function(station){
            deferred.resolve(station);
        });

        return deferred.promise;
    };

    this.putStation = function() {
        var deferred = $q.defer();

        var Station = $resource('/api/station', {}, {
          update: { method: 'PUT' }
        });
        Station.update(function(station){
            deferred.resolve(station);
        });

        return deferred.promise;
    };

    this.saveIPAddress = function(station_id, host, port) {
        var Station =  $resource('/api/station/ip/:id', {id: station_id});
        Station.save({"host":host, "port":port});
    }

    this.saveNumValves = function(station_id, num_valves) {
        var Station =  $resource('/api/station/valves/:id', {id: station_id});
        Station.save({"num_valves":num_valves});

        // now, get updated station to return
        var deferred = $q.defer();

        var Station = $resource('/api/station/:id', {id: station_id});
        Station.get(function(station){
            deferred.resolve(station);
        });

        return deferred.promise;
    }

    this.saveIngredient = function(station_id, ingredient) {
        var Station = $resource('/api/station/ingredient/:id', {id: station_id});
        Station.save(ingredient);
    };
});
