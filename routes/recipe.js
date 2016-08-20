var express = require('express');
var router = express.Router();
var Recipe = require('../models/recipe.model');

router.post('/save', function(req, res) {
    var recipe = new Recipe(req.body);

    recipe.save(function (err, status) {
        if (err) return (err);

        res.json(status);
    });
});

module.exports = router;
