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

router.get('/brands/:type', function(req, res) {
    // query based on Type and get all Brands associated with it
    // specifically remove _id
    Liquor.findOne({"type": req.params.type}, 'item.brand -_id', function (err, type) {
        if (err) return (err);

        // remove duplicate Brands
        // http://stackoverflow.com/a/31963129
        var uniq_brands = type.item.reduceRight(function (r, a) {
            r.some(function (b) { return a.brand === b.brand; }) || r.push(a);
            return r;
        }, []);

        res.json(uniq_brands);
    })
});

router.post('/save', function(req, res) {
    // add the data into the type's document
    Liquor.findOne({"type": req.body.type}, function (err, type) {
        if (err) return (err);

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
