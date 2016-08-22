app.service("liquidService",
    function($resource, $q) {

        this.getTypes = function() {
            var deferred = $q.defer();

            var Types = $resource('/api/liquid/types');

            Types.query(function(types){
                deferred.resolve(types);
            });

            return deferred.promise;
        };

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

        this.getBrands = function(type) {
            var deferred = $q.defer();

            var Types = $resource('/api/liquid/brands/:type', {type: type});
            Types.query(type, function(brands){
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
