var express = require('express');
var router = express.Router();
var Recipe = require('../models/recipe.model');

router.post('/save', function(req, res) {
    var recipe = new Recipe(req.body);

    recipe.save(function (err, status) {
        if (err) return (err);

        res.json(status);
    });
});

// code previously used on the "drinks" endpoint
/*
router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.get('drinks');
    collection.find({},function(err, drinks){
        if (err) throw err;
        res.json(drinks);
    });
});

// determines if the id passed as a parameter is valid for the database,
// and that it is found in the database,
// and then finally passes the ID on if its good,
// otherwise returns an error in JSON
router.get('/:id', function(req, res) {
    var drink_id = req.params.id;

    if (dbHelper.isValidObjectID(drink_id))
    {
        // look in the user database for key with id from URL parameter
        var db = req.db;
        var collection = db.get('drinks');
        collection.findOne({ "_id": mongo.ObjectID(drink_id) },function(err,user){
            if (err) throw err;
            if (user !== null) {
                res.json(user);
            }
            else {
                res.json({"error" : "not_found"});
            }
        });
    }
    else {
        res.json({"error" : "not_valid_objectId"});
    }
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
*/

module.exports = router;
