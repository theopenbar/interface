var express = require('express');
var router = express.Router();
var Bottle = require('../models/bottle.model');

router.post('/', function(req, res) {
    var bottle = new Bottle(req.body);

    bottle.save(function (err, returned) {
        if (err) return res.status(500).json({err: err});
        res.json(returned);
    });
});

router.post('/query', function(req, res) {
    // query based on Type and/or Subtype and/or Brand
    Bottle.find(req.body).exec(function (err, descriptions) {
        if (err) return res.status(500).json({err: err});

        res.json(descriptions);
    });
});

router.get('/:id', function(req, res) {
    Bottle.findById(req.params.id).exec(function (err, liquid) {
        if (err) return res.status(500).json({err: err});
        res.json(liquid);
    })
});

module.exports = router;
