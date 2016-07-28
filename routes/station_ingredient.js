var express = require('express');
var router = express.Router();
var mongo = require('mongodb');

// http://stackoverflow.com/a/21976486
function isTrue(value){
    if (typeof(value) == 'string'){
        value = value.toLowerCase();
    }
    switch(value){
        case true:
        case "true":
        case 1:
        case "1":
        case "on":
        case "yes":
            return true;
        default:
            return false;
    }
}

router.post('/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('stations');
    // edit item in ingredients array
    collection.update({ "_id": mongo.ObjectID(req.params.id), "ingredients.valve":parseInt(req.body.valve) },
        { $set:
            { 
                "ingredients.$.type": req.body.type,
                "ingredients.$.amount": parseFloat(req.body.amount),
                "ingredients.$.pressurized": isTrue(req.body.pressurized)
            }
        },
        function(err,station){
            if (err) throw err;
            res.json({"status":"done"});
    });
});

module.exports = router;
