app.service("liquidService",
    function($resource, $q) {

        /*
        this.putIngredient = function() {
            var deferred = $q.defer();
    
            var Ingredient = $resource('/api/liquid', {}, {
              update: { method: 'PUT' }
            });

            Ingredient.update(function(ingredient){
                deferred.resolve(ingredient);
            });

            return deferred.promise;
        };
        */

        this.getBrands = function(query) {
            var deferred = $q.defer();

            // return an array
            var Types = $resource('/api/liquid/brands/', {}, {
                save: {method: 'POST', isArray:true}
            });

            Types.save(query, function(brands){
                deferred.resolve(brands);
            });

            return deferred.promise;
        };

        this.saveIngredient = function(ingredient) {
            var deferred = $q.defer();

            var Ingredients = $resource('/api/liquid/save');
            Ingredients.save(ingredient, function(ingredient){
                deferred.resolve(ingredient);
            });

            return deferred.promise;
        };
});
