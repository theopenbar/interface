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

        this.saveLiquid = function(liquid) {
            var deferred = $q.defer();

            var Liquids = $resource('/api/liquid/save');
            Liquids.save(liquid, function(status){
                deferred.resolve(status);
            });

            return deferred.promise;
        };

        this.getLiquids = function(query) {
            var deferred = $q.defer();

            // return an array
            var Types = $resource('/api/liquid/query/', {}, {
                save: {method: 'POST', isArray:true}
            });

            Types.save(query, function(brands){
                deferred.resolve(brands);
            });

            return deferred.promise;
        };

        this.getLiquid = function(id) {
            var deferred = $q.defer();

            var Liquid = $resource('/api/liquid/:id', {id: id});

            Liquid.get(function(liquid){
                deferred.resolve(liquid);
            });

            return deferred.promise;
        };
});
