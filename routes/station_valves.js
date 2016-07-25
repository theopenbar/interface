var express = require('express');
var router = express.Router();
var mongo = require('mongodb');

router.post('/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('stations');
    collection.update({ "_id": mongo.ObjectID(req.params.id) },
        {$set:
            {num_valves: req.body.num_valves}
        },
        function(err, valves){
            if (err) throw err;
            res.json(valves);
        });
});

module.exports = router;
