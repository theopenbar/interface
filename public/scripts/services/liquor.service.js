app.service("liquorService",
    function($resource, $q) {

        this.getTypes = function() {
            var deferred = $q.defer();
    
            var Types = $resource('/api/liquor');
            Types.query(function(types){
                deferred.resolve(types);
            });
    
            return deferred.promise;
        };
});
