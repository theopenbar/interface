var express = require('express');
var router = express.Router();
var mongo = require('mongodb');

// http://stackoverflow.com/a/18547480
function isValidObjectID(str) {
  // coerce to string so the function can be generically used to test both strings and native objectIds created by the driver
  str = str + '';
  var len = str.length, valid = false;
  if (len == 12 || len == 24) {
    valid = /^[0-9a-fA-F]+$/.test(str);
  }
  return valid;
}

// determines if the id passed as a URL parameter is valid for the database,
// and that it is found in the database,
// and then finally passes the ID on if its good
function parseID(req, res, next) {
    var station_id = req.query.id;

    if (isValidObjectID(station_id))
    {
        // look in the stations database for key with id from URL parameter
        var db = req.db;
        var collection = db.get('stations');
        collection.findOne({ "_id": mongo.ObjectID(station_id) },function(err,result){
            console.log(result);
            if (err) {
                res.end('Error in first query. ' + err)
            }
            if (result !== null) {
                req.id = station_id;
                req.json = JSON.stringify(result, undefined, 2);
                return next();
            }
            else {
                res.render('station_error', { error : "not found", id: station_id});
            }
        });
    }
    else {
        res.render('station_error', { error : "not valid", id: station_id});
    }
}

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

function findDrinks(req, res, next) {

    // Let's find all the recipes
    StationModel.find({}).exec(function(err, result) {
        if (!err) {
            //
            console.log(result);



            //req.json2 = JSON.stringify(result, undefined, 2);
            //req.length2 = result.length;
            //res.render('drinks_queried', {json: req.json, length: req.length, json2: req.json2, length2: req.length2})
            //res.end('drinks_queried')
            //res.render('drinks_queried', {json2: JSON.stringify(result, undefined, 2)})
            //res.end(html4 + JSON.stringify(result, undefined, 2) + html5 + result.length + html6);
        } else {
            // just render the data from getDatabase() if query fails
            res.render('drinks', {json: req.json, length: req.length})

            res.end('Error in second query. ' + err)
        }
    });


    res.render('station', { id: req.id, details: req.json, valves: req.ingredients });

}


router.get('/', parseID, drawValves, findDrinks);

module.exports = router;
