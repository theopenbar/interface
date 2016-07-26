var express = require('express');
var router = express.Router();
var mongo = require('mongodb');

router.post('/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('stations');

    // first, update the number of valves in the database
    collection.update({ "_id": mongo.ObjectID(req.params.id) },
        {$set:
            {num_valves: req.body.num_valves}
        },
        function(err, valves){
            if (err) throw err;
            // probably shouldn't return here
            res.json(valves);
        });

    // testing the ability to update ingredients array based  on num_valves
    collection.findOne({ "_id": mongo.ObjectID(req.params.id) },function(err,station){
        if (err) throw err;
        if (station !== null) {
            //console.log(data);
            console.log(station.ingredients.length)

            // if less ingredients than number of valves, add some
            if (station.ingredients.length < station.num_valves) {
                //collection.update()
            }
            // else, delete some
            else {

            }
        }
    });
});

module.exports = router;
