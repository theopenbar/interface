var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.get('drinks');
    collection.find({},function(err, drinks){
        if (err) throw err;
        res.json(drinks);
    });
});

router.post('/', function(req, res) {
    var db = req.db;
    var collection = db.get('drinks');
    collection.insert({
        name: req.body.name,
        recipe: req.body.recipe
    }, function(err, drink){
        if (err) throw err;
        res.json(drink);
    });
});

module.exports = router;
