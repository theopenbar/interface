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
            // don't return here -- more to do
            //res.json(valves);
        });

    // add/remove items in ingredients array based on num_valves
    collection.findOne({ "_id": mongo.ObjectID(req.params.id) },function(err,station){
        if (err) throw err;
        if (station !== null) {

            // if less ingredients than num_valves, add some
            if (station.ingredients.length < station.num_valves) {
                // loop through new, large num_valves
                for (var valve_num = 1; valve_num <= station.num_valves; valve_num++) {
                    var found = false;
                    // try to find that valve_num
                    for (var v in station.ingredients) {
                        if(station.ingredients[v].valve == valve_num){
                            found = true;
                        }
                    }
                    // if we can't find that valve_num, add it to the array
                    if (found == false) {
                        collection.update({ "_id": mongo.ObjectID(req.params.id) },
                            { $addToSet:
                                { ingredients:
                                    {
                                        "type": "",
                                        "valve": valve_num,
                                        "amount": 0,
                                        "flow_factor": 0,
                                        "pressurized": false
                                    }
                                }
                            },
                            function(err,station){
                                if (err) throw err;
                        });
                    }
                }
            }
            // if more ingredients than num_valves, delete some
            else if (station.ingredients.length > station.num_valves){
                // loop through valves that are too high
                for (var valve_num = station.ingredients.length; valve_num > station.num_valves; valve_num--) {
                    // remove that valve_num
                    collection.update({ "_id": mongo.ObjectID(req.params.id) },
                            { $pull : {ingredients: {"valve": valve_num}} },
                            function(err,station){
                                if (err) throw err;
                        });
                }
            }
        }
        res.json({"status":"done"});
    });
});

module.exports = router;
