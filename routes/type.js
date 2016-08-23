var express = require('express');
var router = express.Router();
var Type = require('../models/type.model');

router.get('/types', function(req, res) {
    // specifically remove _id
    Type.find({}, 'type -_id', function (err, type) {
        if (err) return (err);
        res.json(type);
    })
});

router.post('/types', function(req, res) {
    var type = new Type(req.body);
    
    type.save(function (err, status) {
        if (err) return (err);
        res.json(status);
    });
});

router.get('/subtypes/:type', function(req, res) {
    // query based on Type and get all Brands associated with it
    // specifically remove _id
    Type.findOne({"type": req.params.type}, 'subtypes.subtype -_id', function (err, subtypes) {
        if (err) return (err);

        res.json(subtypes.subtypes);
    })
});

module.exports = router;
