app.service('drinksService', function($resource, $q) {

    var deferred = $q.defer();

    this.getDrinks = function() {
        var Drinks = $resource('/api/drinks');
        Drinks.query(function(drinks){
            deferred.resolve(drinks);
        });

        return deferred.promise;
    };

    this.saveDrink = function(data) {
        var Drinks = $resource('/api/drinks');
        Drinks.save(data);
    };

    this.getTypes = function() {
        var Types = $resource('/api/types');
        Types.query(function(types){
            deferred.resolve(types);
        });

        return deferred.promise;
    };
});
