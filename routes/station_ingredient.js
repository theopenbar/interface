var express = require('express');
var router = express.Router();
var mongo = require('mongodb');

router.post('/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('stations');
    // edit item in ingredients array
    collection.update({ "_id": mongo.ObjectID(req.params.id), "ingredients.valve":req.body.valve },
        { $set:
            { 
                "ingredients.$.type": req.body.type,
                "ingredients.$.amount": req.body.amount,
                "ingredients.$.pressurized": req.body.pressurized
            }
        },
        function(err,station){
            if (err) throw err;
            res.json({"status":"done"});
    });
});

module.exports = router;
