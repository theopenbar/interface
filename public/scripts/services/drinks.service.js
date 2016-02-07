app.service('drinksService', function($resource, $q) {

    var deferred = $q.defer();

    var Drinks = $resource('/api/drinks');
    Drinks.query(function(drinks){
        deferred.resolve(drinks);
    });

    this.getDrinks = function() {
        return deferred.promise;
    };
});
