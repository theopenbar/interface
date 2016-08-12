var express = require('express');
var router = express.Router();
var Liquor = require('../models/liquor.model');

router.get('/types', function(req, res) {
    // specifically remove _id
    Liquor.find({}, 'type -_id', function (err, type) {
        if (err) return (err);
        res.json(type);
    })
});

router.post('/save', function(req, res) {
    // add the data into the type's document
    Liquor.findOne({"type": req.body.type}, function (err, type) {
        if (err) return (err);

        var newLiquor = new Liquor(type);

        type.item.push({
            "brand": req.body.brand,
            "description": req.body.description,
            "amount": req.body.amount,
            "barcode": req.body.barcode
        });

        type.save(function (err, status) {
            if (err) return (err);
            res.json(status);
        });
    });
});

module.exports = router;
