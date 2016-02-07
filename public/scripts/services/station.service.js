app.service("stationService", function($resource, $q) {

    var deferred = $q.defer();

    this.getStation = function(station_id) {
        var Station = $resource('/api/station/:id', {id: station_id});
        Station.get(function(station){
            deferred.resolve(station);
        });

        return deferred.promise;
    };
});
