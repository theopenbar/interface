app.service('commanderService',
    function($localStorage, $resource, $location, $q) {
   

    this.sendCommand = function(command, commandData) {
        
        var Commander =  $resource('/api/commander');
        Commander.save({"command":command,"commandData":commandData});
        
    };

    this.putUser = function(user_id, data) {
        var User = $resource('/api/user/:id', {id: user_id}, {
          update: { method: 'PUT' }
        });
        User.update(data);
    };
});
