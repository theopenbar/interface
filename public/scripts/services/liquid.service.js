app.service("liquidService",
    function($resource, $q) {

        this.saveLiquid = function(liquid) {
            var deferred = $q.defer();

            var Liquids = $resource('/api/liquid');
            Liquids.save(liquid, function(returned){
                deferred.resolve(returned);
            });

            return deferred.promise;
        };

        this.getLiquids = function(query) {
            var deferred = $q.defer();

            // return an array
            var Types = $resource('/api/liquid/query', {}, {
                save: {method: 'POST', isArray:true}
            });

            Types.save(query, function(liquids){
                deferred.resolve(liquids);
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

        this.getBottles = function(query) {
            var deferred = $q.defer();

            // return an array
            var Types = $resource('/api/bottle/query', {}, {
                save: {method: 'POST', isArray:true}
            });

            Types.save(query, function(bottles){
                deferred.resolve(bottles);
            });

            return deferred.promise;
        };

        this.saveBottle = function(bottle) {
            var deferred = $q.defer();

            var Bottles = $resource('/api/bottle');
            Bottles.save(bottle, function(returned){
                deferred.resolve(returned);
            });

            return deferred.promise;
        }
});
