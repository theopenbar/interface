app.service('commanderService',
    function($localStorage, $resource, $location, $q) {
   
        this.sendCommand = function(command, commandData) {
            var Commander =  $resource('/api/commander');
            Commander.save({"command":command,"commandData":commandData});
        };
});
