app.service("userService", function($resource, $q) {

    var deferred = $q.defer();

    this.getUser = function(user_id) {
        var User = $resource('/api/user/:id', {id: user_id});
        User.get(function(user){
            deferred.resolve(user);
        });

        return deferred.promise;
    };

    this.putUser = function(user_id, data) {
        var User = $resource('/api/user/:id', {id: user_id}, {
          update: { method: 'PUT' }
        });
        User.update(data);
    };
});
