var express = require('express');
var router = express.Router();
var Station = require('../models/station.model');

router.get('/:id', function(req, res) {
    Station.findOne({"_id": req.params.id}, function (err, station) {
        if (err) return (err);
        res.json(station);
    })
});

module.exports = router;
