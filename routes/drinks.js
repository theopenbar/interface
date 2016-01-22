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
    name: {
        ingredient: { type: Number}
    }
});

// compiles schema into a model
var DrinksModel = mongoose.model('drinks', drinksSchema);

// In case the browser connects before the database is connected, the
// user will see this message.
var found = ['DB Connection not yet established.  Try again later.  Check the console output for error messages if this persists.'];

router.get('/', function(req, res) {
    // Let's find all the documents
    DrinksModel.find({}).exec(function(err, result) {
        if (!err) {
            res.end(html1 + JSON.stringify(result, undefined, 2) +  html2 + result.length + html3);
        } else {
            res.end('Error in first query. ' + err)
        };
    });
});

//
// The rudimentary HTML content in three pieces.
var html1 = '<head> \
<style> body {color: #394a5f; font-family: sans-serif} </style> \
</head> \
<body> \
<h2> All Documents in MonogoDB database </h2> <pre><code> ';var html2 = '</code></pre> <br\> <i>';
var html3 = ' documents. </i>';

module.exports = router;
