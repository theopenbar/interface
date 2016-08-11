var express = require('express');
var router = express.Router();
var Liquor = require('../models/liquor.model');

router.get('/types', function(req, res) {
    // specifically remove _id
    Liquor.find({}, 'type -_id', function (err, type) {
        if (err) return (err);
        res.json(type);
    })
});

/*
// will need to change to support new document structure

// create a new document in stations and return it's information
router.put('/', function(req, res) {
    var db = req.db;
    var collection = db.get('stations');
    collection.insert({
        "ingredients": [],
        "host": "localhost",
        "port": 8080,
        "num_valves": 10
    }, function(err,id){
        if (err) throw err;
        res.json(id);
    });
});
*/

module.exports = router;
