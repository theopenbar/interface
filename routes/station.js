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

router.get('/', function(req, res, next) {

    var station_id = req.query.id;

    if (mongoose.Types.ObjectId.isValid(station_id))
    {
        // Let's find all the documents
        StationModel.find({}).exec(function(err, result) {
            // look in the stations database for key with id from URL parameter
            var query = StationModel.find({ "_id": station_id });
            query.exec(function(err, result) {
                if (!err) {
                    res.render('station', { id: req.query.id, details: JSON.stringify(result, undefined, 2) });
                } else {
                    res.end('Error in first query. ' + err)
                };
            });
        });
    }
    else {
        res.render('station_error', { error : "not valid", id: station_id});
    }
});

module.exports = router;
