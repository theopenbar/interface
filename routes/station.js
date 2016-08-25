var express = require('express');
var router = express.Router();
var Station = require('../models/station.model');

router.get('/:id', function(req, res) {
    Station.findOne({"_id": req.params.id}, function (err, station) {
        if (err) return (err);
        res.json(station);
    })
});

// create a new document in stations and return it's information
router.put('/', function(req, res) {
    var station = new Station({
        "host": "localhost",
        "port": 8080,
        "num_valves": 10
    });

    station.save(function (err, status) {
        if (err) return (err);

        res.json(status);
    });
});

module.exports = router;
