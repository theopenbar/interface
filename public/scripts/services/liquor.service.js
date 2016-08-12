app.service("liquorService",
    function($resource, $q) {

        this.getTypes = function() {
            var deferred = $q.defer();
    
            var Types = $resource('/api/liquor/types');
            Types.query(function(types){
                deferred.resolve(types);
            });
    
            return deferred.promise;
        };

        this.saveIngredient = function(ingredient) {
            var deferred = $q.defer();

            var Ingredients = $resource('/api/liquor/save');
            Ingredients.save(ingredient, function(ingredient){
                deferred.resolve(ingredient);
            });

            return deferred.promise;
        };
});
