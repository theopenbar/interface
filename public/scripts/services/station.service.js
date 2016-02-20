app.service("stationService",
    function($localStorage, $resource, $location, $q) {

    // look for station in URL params
    var url_params = $location.search();
    var station_id = url_params.station;

    // if it's there, save it locally
    if (station_id != undefined) {
        $localStorage.stationId = station_id;
    }

    var deferred = $q.defer();

    this.getStation = function(station_id) {
        var Station = $resource('/api/station/:id', {id: station_id});
        Station.get(function(station){
            deferred.resolve(station);
        });

        return deferred.promise;
    };
});
