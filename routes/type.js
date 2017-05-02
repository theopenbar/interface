var express = require('express');
var router = express.Router();
var Type = require('../models/type.model');

router.get('/types', function(req, res) {
    // specifically remove _id
    Type.find({}, 'type -_id', function (err, type) {
        if (err) return res.status(500).json({err: err});
        res.json(type);
    })
});

router.get('/subtypes/:type', function(req, res) {
    // query based on Type and get all Brands associated with it
    // specifically remove _id
    Type.findOne({"type": req.params.type}, 'subtypes.subtype', function (err, subtypes) {
        if (err) return res.status(500).json({err: err});

        res.json(subtypes.subtypes);
    })
});

module.exports = router;
