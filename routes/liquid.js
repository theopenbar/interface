var express = require('express');
var router = express.Router();
var Liquid = require('../models/liquid.model');

router.post('/brands', function(req, res) {
    // query based on Type and Subtype and get all Brands associated with it
    // specifically remove _id
    Liquid.find(req.body, 'brand -_id', function (err, brands) {
        if (err) return (err);

        // remove duplicate Brands
        // http://stackoverflow.com/a/31963129
        var uniq_brands = brands.reduceRight(function (r, a) {
            r.some(function (b) { return a.brand === b.brand; }) || r.push(a);
            return r;
        }, []);

        res.json(brands);
    });
});

router.post('/descriptions', function(req, res) {
    // query based on Type, Subtype, Brand and get all Descriptions associated with it
    // specifically remove _id
    Liquid.find(req.body, '-_id', function (err, descriptions) {
        if (err) return (err);

        res.json(descriptions);
    });
});

router.post('/save', function(req, res) {
    var liquid = new Liquid(req.body);

    liquid.save(function (err, status) {
        if (err) return (err);
        res.json(status);
    });
});

module.exports = router;
