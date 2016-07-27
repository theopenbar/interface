var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var dbHelper = require('./dbHelper');

router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.get('types');
    collection.find({},function(err, types){
        if (err) throw err;
        res.json(types);
    });
});

module.exports = router;
