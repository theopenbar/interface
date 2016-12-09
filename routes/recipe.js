var express = require('express');
var router = express.Router();
var Recipe = require('../models/recipe.model');

router.get('/:id', function(req, res) {
    Recipe.findById(req.params.id).populate('liquids.id')
    .exec(function (err, recipe) {
        if (err) return res.status(500).json({err: err});
        res.json(recipe);
    })
});

router.post('/save', function(req, res) {
    var recipe = new Recipe(req.body);

    recipe.save(function (err, status) {
        if (err) return res.status(500).json({err: err});

        res.json(status);
    });
});

module.exports = router;
