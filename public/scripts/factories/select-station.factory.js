// used to determine if the page knows what station it's assigned to
app.factory('SelectStation', function($q, $location, $localStorage, $rootScope, $state, stationService) {

    return {
        // checks if the station is in the URL or stored in localStorage
        findStationOnPage: function() {
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
                return true;
            }
            // maybe it's in localStorage?
            else if ($localStorage.stationId != undefined){
                return true;
            }
            // no station ID
            else {
                // store current state in rootScope so we can return to it later
                $rootScope.returnToState = $state.current.name;
                // go to select-station view
                $state.go('select-station');
            }
        }
    };

});
