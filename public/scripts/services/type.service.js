app.service("typeService",
    function($resource, $q) {
        this.getTypes = function() {
            var deferred = $q.defer();

            var Types = $resource('/api/type/types',{},{get:{isArray:true}});

            Types.get(function(types){
                deferred.resolve(types);
            });

            return deferred.promise;
        }

        this.getSubtypes = function(type) {
            var deferred = $q.defer();

            var Subtypes = $resource('/api/type/subtypes/:type', {type: type},{get:{isArray:true}});

            Subtypes.get(function(subtypes){
                deferred.resolve(subtypes);
            });

            return deferred.promise;
        }
});
