var express = require('express');
var router = express.Router();
var mongo = require('mongodb');

router.post('/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('stations');
    collection.update({ "_id": mongo.ObjectID(req.params.id) },
        {$set:
            {host: req.body.host}
        },
        {$set:
            {port: req.body.port}
        },
        function(err, ip){
            if (err) throw err;
            res.json(ip);
        });
});

module.exports = router;
