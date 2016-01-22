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

/*
function getDatabase(req, res) {
    // Let's find all the documents
    DrinksModel.find({}).exec(function(err, result) {
        if (!err) {
            req.json = JSON.stringify(result, undefined, 2);
            req.length = result.length;
            return next();
            //res.render('drinks', {json: JSON.stringify(result, undefined, 2), length: result.length})
        } else {
            res.end('Error in first query. ' + err)
        };
    });
}
*/

router.get('/', function(req, res, next) {
  res.render('station', { id: '1234' });
});

module.exports = router;
