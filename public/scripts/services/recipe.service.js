app.service("recipeService",
    function($resource, $q) {

        this.saveRecipe = function(recipe) {
            var deferred = $q.defer();

            var Recipe = $resource('/api/recipe/save');
            Recipe.save(recipe, function(recipe){
                deferred.resolve(recipe);
            });

            return deferred.promise;
        };
});
