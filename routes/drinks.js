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

var drinksSchema = new mongoose.Schema({
    "name": String,
    "recipe": { ingredient: String, quantity: Number }
});

// compiles schema into a model
var DrinksModel = mongoose.model('drinks', drinksSchema);

// In case the browser connects before the database is connected, the
// user will see this message.
var found = ['DB Connection not yet established.  Try again later.  Check the console output for error messages if this persists.'];


function getDatabase(req, res, next) {
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

function queryDatabase(req, res) {
    // Let's find all the documents
    DrinksModel.find({}).exec(function(err, result) {
        // Let's see if there are....
        var query = DrinksModel.find({ "recipe.cola": { $exists: true } }); // (ok in this example, it's all entries)
        //query.where('age').gt(64);
        query.exec(function(err, result) {
            if (!err) {
                req.json2 = JSON.stringify(result, undefined, 2);
                req.length2 = result.length;
                res.render('drinks_queried', {json: req.json, length: req.length, json2: req.json2, length2: req.length2})
                //res.end('drinks_queried')
                //res.render('drinks_queried', {json2: JSON.stringify(result, undefined, 2)})
                //res.end(html4 + JSON.stringify(result, undefined, 2) + html5 + result.length + html6);
            } else {
                // just render the data from getDatabase() if query fails
                res.render('drinks', {json: req.json, length: req.length})

                res.end('Error in second query. ' + err)
            }
        });
    });
}

router.get('/', getDatabase, queryDatabase);

module.exports = router;
