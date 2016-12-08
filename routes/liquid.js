var express = require('express');
var router = express.Router();
var Liquid = require('../models/liquid.model');

router.post('/', function(req, res) {
    var liquid = new Liquid(req.body);

    liquid.save(function (err, returned) {
        if (err) return res.status(500).json({err: err});
        res.json(returned);
    });
});

router.post('/query', function(req, res) {
    // query based on Type and/or Subtype and/or Brand
    Liquid.find(req.body).exec(function (err, descriptions) {
        if (err) return res.status(500).json({err: err});

        res.json(descriptions);
    });
});

router.get('/:id', function(req, res) {
    Liquid.findById(req.params.id).exec(function (err, liquid) {
        if (err) return res.status(500).json({err: err});
        res.json(liquid);
    })
});

module.exports = router;
