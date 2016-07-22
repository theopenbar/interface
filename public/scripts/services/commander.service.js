app.service('commanderService',
    function($localStorage, $resource, $location, $q) {
   
        this.sendCommand = function(station_id, command, commandData) {
            var Commander =  $resource('/api/commander');
            Commander.save({"stationId":station_id, "command":command, "commandData":commandData});
        };
});
