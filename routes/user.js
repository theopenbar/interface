var express = require('express');
var router = express.Router();
var mongo = require('mongodb');

// http://stackoverflow.com/a/18547480
function isValidObjectID(str) {
  // coerce to string so the function can be generically used to test
  // both strings and native objectIds created by the driver
  str = str + '';
  var len = str.length, valid = false;
  if (len == 12 || len == 24) {
    valid = /^[0-9a-fA-F]+$/.test(str);
  }
  return valid;
}

// determines if the id passed as a parameter is valid for the database,
// and that it is found in the database,
// and then finally passes the ID on if its good,
// otherwise returns an error in JSON
router.get('/:id', function(req, res) {
    var station_id = req.params.id;

    if (isValidObjectID(station_id))
    {
        // look in the stations database for key with id from URL parameter
        var db = req.db;
        var collection = db.get('stations');
        collection.findOne({ "_id": mongo.ObjectID(station_id) },function(err,station){
            if (err) throw err;
            if (station !== null) {
                res.json(station);
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
