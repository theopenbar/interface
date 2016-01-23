var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
// replace with some process.env variables in the future
mongoose.connect('mongodb://fakeuser:fakepassword@ds035004.mongolab.com:35004/heroku_ff1ms21p');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
});

var stationSchema = new mongoose.Schema({
    "ip-address": String,
    "ingredients": { String }
});

// compiles schema into a model
var StationModel = mongoose.model('station', stationSchema);

// In case the browser connects before the database is connected, the
// user will see this message.
var found = ['DB Connection not yet established.  Try again later.  Check the console output for error messages if this persists.'];

// determines if the id passed as a URL parameter is valid for the database,
// and that it is found in the database,
// and then finally passes the ID on if its good
function parseID(req, res, next) {
    var station_id = req.query.id;

    if (mongoose.Types.ObjectId.isValid(station_id))
    {
        // look in the stations database for key with id from URL parameter
        var query = StationModel.findOne({ "_id": station_id });
        query.exec(function(err, result) {
            if (err) {
                res.end('Error in first query. ' + err)
            }
            if (result !== null) {
                req.id = station_id;
                req.json = JSON.stringify(result, undefined, 2);
                return next();
                //res.render('station', { id: req.query.id, details: JSON.stringify(result, undefined, 2) });
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

    //res.render('station', { id: req.id, details: req.json, valves: ingredients });
}

function findDrinks(req, res, next) {


    res.render('station', { id: req.id, details: req.json, valves: req.ingredients });

}


router.get('/', parseID, drawValves, findDrinks);

module.exports = router;
