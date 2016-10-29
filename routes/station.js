var express = require('express');
var router = express.Router();
var Station = require('../models/station.model');

router.get('/:id', function(req, res) {
    Station.findById(req.params.id, function (err, station) {
        if (err) return (err);
        res.json(station);
    })
});

router.post('/', function(req, res) {
    station = new Station(req.body);
    station.save(function (err, status) {
        if(err) return (err);
        res.json(station);
    });
});

router.put('/:id', function(req, res) {
    Station.findById(req.params.id, function(err, station) {
        if (!station) return next(new Error('Could not find Station'));
        else {
            station.modified = new Date();
            station.update(req.body, function(err, status) {
                if(err) return (err);
                Station.findById(req.params.id, function(err, updated_station) {
                    if(err) return(err);
                    res.status(status).json(updated_station);
                });
            });
        }
    });
});

module.exports = router;
