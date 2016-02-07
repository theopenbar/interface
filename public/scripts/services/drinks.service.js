app.service('drinksService', function($resource, $q) {

    var deferred = $q.defer();

    this.getDrinks = function() {
        var Drinks = $resource('/api/drinks');
        Drinks.query(function(drinks){
            deferred.resolve(drinks);
        });

        return deferred.promise;
    };
});
