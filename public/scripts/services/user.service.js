app.service("userService",
    function($localStorage, $resource, $location, $q) {

    // look for user in URL params
    var url_params = $location.search();
    var user_id = url_params.user;

    // if it's there, save it locally
    if (user_id != undefined) {
        $localStorage.userId = user_id;
    }

    var deferred = $q.defer();

    this.getUser = function(user_id) {
        var User = $resource('/api/user/:id', {id: user_id});
        User.get(function(user){
            deferred.resolve(user);
        });
        return deferred.promise;
    };

    this.putUser = function(user_id, data) {
        var User = $resource('/api/user/:id', {id: user_id});
        User.put(data);
    };
});
