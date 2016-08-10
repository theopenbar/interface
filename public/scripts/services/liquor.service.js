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

        this.putIngredient = function() {
            var deferred = $q.defer();
    
            var Ingredient = $resource('/api/liquor', {}, {
              update: { method: 'PUT' }
            });
            Ingredient.update(function(ingredient){
                deferred.resolve(ingredient);
            });

            return deferred.promise;
        };
});
