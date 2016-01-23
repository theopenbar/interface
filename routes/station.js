var express = require('express');
var router = express.Router();
var mongo = require('mongodb');

// http://stackoverflow.com/a/18547480
function isValidObjectID(str) {
  // coerce to string so the function can be generically used to test
  // both strings and native objectIds created by the driver
  str = str + '';
  var len = str.length, valid = false;
  if (len == 12 || len == 24) {
    valid = /^[0-9a-fA-F]+$/.test(str);
  }
  return valid;
}

/* we can put this at /station/view (or similiar) later

function drawValves(req, res, next) {
    const NUM_VALVES = 12;
    // empty array to store ingredients
    var ingredients = [];

    // we have the JSON from parseID()
    var json_parsed = JSON.parse(req.json);

    // loop through the 12 possible values and assign an ingredient to each
    for (i=0; i < NUM_VALVES; i++) {
        var gpio_key = "gpio".concat(i);

        if (json_parsed[gpio_key] != undefined) {
            ingredients[i] = json_parsed[gpio_key].name;
        }
        else {
            ingredients[i] = null;
        }
    }

    req.ingredients = ingredients;
    return next();
}
*/

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

// determines if the id passed as a URL parameter is valid for the database,
// and that it is found in the database,
// and then finally passes the ID on if its good
router.get('/', function(req, res) {
    var station_id = req.query.id;

    if (isValidObjectID(station_id))
    {
        // look in the stations database for key with id from URL parameter
        var db = req.db;
        var collection = db.get('stations');
        //collection.findOne({ "_id": mongo.ObjectID(station_id) },function(err,station){
        collection.find({},function(err,station){
            //console.log(result);
            if (err) throw err;
            if (station !== null) {
                res.json(station);
            }
            else {
                res.render('station_error', { error : "not found", id: station_id});
            }
        });
    }
    else {
        res.render('station_error', { error : "not valid", id: station_id});
    }
});

module.exports = router;
