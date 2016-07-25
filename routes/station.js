var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var dbHelper = require('./dbHelper');

/* we'll want this on the main page later

function findDrinks(req, res, next) {

    // Let's find all the recipes
    var db = req.db;
    var collection = db.get('drinks');
    collection.find({},function(err,result){
        if (!err) {
            // array of drinks we can make
            var drinks = [];

            // go through each recipe in collection 'drinks'
            result.forEach(function(item, index) {
                // assume true -- will be false if we can't find one ingredient
                var canMake = true;

                // go through each ingedient in the recipe
                for(var ingredient in item.recipe){
                    // make sure that ingredient is in req.ingredients
                    // returns -1 if not found
                    if (req.ingredients.indexOf(ingredient) < 0) {
                        // if there's an ingedient in the recipe that we don't have,
                        // make it false
                        canMake = false;
                    }
                }

                // as long as we have all ingredients, add recipe to drinks[]
                if (canMake) {
                    drinks.push(item.name);
                }
            });

            res.render('station', { id: req.id, details: req.json, valves: req.ingredients, "drinks": drinks });
        } else {
            res.end('Error in second query. ' + err)
        }
    });
}
*/

// determines if the id passed as a parameter is valid for the database,
// and that it is found in the database,
// and then finally passes the ID on if its good,
// otherwise returns an error in JSON
router.get('/:id', function(req, res) {
    var station_id = req.params.id;

    if (dbHelper.isValidObjectID(station_id))
    {
        // look in the stations database for key with id from URL parameter
        var db = req.db;
        var collection = db.get('stations');
        collection.findOne({ "_id": mongo.ObjectID(station_id) },function(err,station){
            if (err) throw err;
            if (station !== null) {
                res.json(station);
            }
            else {
                res.json({"error" : "not_found"});
            }
        });
    }
    else {
        res.json({"error" : "not_valid_objectId"});
    }
});

router.post('/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('stations');
    console.log(req.body);
    collection.update({ "_id": mongo.ObjectID(req.params.id) },
        {$set:
            {host: req.body.host}
        },
        {$set:
            {port: req.body.port}
        },
        function(err, ip){
            if (err) throw err;
            res.json(ip);
        });
});

module.exports = router;
