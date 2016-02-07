var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var dbHelper = require('./dbHelper');

// determines if the id passed as a parameter is valid for the database,
// and that it is found in the database,
// and then finally passes the ID on if its good,
// otherwise returns an error in JSON
router.get('/:id', function(req, res) {
    var user_id = req.params.id;

    if (dbHelper.isValidObjectID(user_id))
    {
        // look in the user database for key with id from URL parameter
        var db = req.db;
        var collection = db.get('users');
        collection.findOne({ "_id": mongo.ObjectID(user_id) },function(err,user){
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

// determines if the id passed as a parameter is valid for the database,
// and that it is found in the database,
// and then finally passes the ID on if its good,
// otherwise returns an error in JSON
router.put('/:id', function(req, res) {
    var user_id = req.params.id;

    if (dbHelper.isValidObjectID(user_id))
    {
        // look in the user database for key with id from URL parameter
        var db = req.db;
        var collection = db.get('users');
        collection.findById(user_id, function(err,user){
            if (err) throw err;
            if (user !== null) {
                var update = {
                    "station": req.body.station,
                    "name": req.body.name,
                    "recipe": req.body.recipe
                };

                collection.updateById(user_id, update, function(err) {
                    if (err) throw err;
                    res.json(user);
                });
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

module.exports = router;
