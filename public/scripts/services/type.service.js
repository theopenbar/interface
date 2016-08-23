app.service("typeService",
    function($resource, $q) {

        this.getTypes = function() {
            var deferred = $q.defer();

            var Types = $resource('/api/type/types');

            Types.query(function(types){
                deferred.resolve(types);
            });

            return deferred.promise;
        };

        this.getSubtypes = function(type) {
            var deferred = $q.defer();

            console.log(type);
            var Subtypes = $resource('/api/type/subtypes/:type', {type: type});

            Subtypes.query(function(subtypes){
                deferred.resolve(subtypes);
            });

            return deferred.promise;
        };
});
