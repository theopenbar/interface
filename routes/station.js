var express = require('express');
var router = express.Router();
var Station = require('../models/station.model');
var Recipe = require('../models/recipe.model');

router.get('/:id', function(req, res) {
    Station.findById(req.params.id).populate(['connectedLiquids.id','onHandLiquids'])
    .exec(function (err, station) {
        if (err) return res.status(500).json({err: err});
        res.json(station);
    })
});

router.post('/', function(req, res) {
    station = new Station(req.body);
    station.save(function (err, status) {
        if (err) return res.status(500).json({err: err});
        res.json(station);
    });
});

router.put('/:id', function(req, res) {
    Station.findById(req.params.id, function(err, station) {
        if (!station) return next(new Error('Could not find Station'));
        else {
            var new_station = req.body;
            station.update(new_station, function(err, status) {
                if (err) {
                    console.log(err);
                    return res.status(500).json({err: err});
                }
                Station.findById(req.params.id).populate(['connectedLiquids.id','onHandLiquids'])
                .exec( function(err, updated_station) {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({err: err});
                    }
                    res.json(updated_station);
                });
            });
        }
    });
});

router.put('/recipes/:id', function(req, res) {
    Station.findById(req.params.id).populate(
        ['connectedLiquids.id','onHandLiquids']).exec(function (err, station) {
        if (err) return (err);
        // get recipes matching station's liquids, and recipe query
        getMatchingRecipes(station, req.body, function(err, recipes){
            if (err) return res.status(500).json({err: err});
            res.json(recipes);
        });
    });
});

function getMatchingRecipes(station, query, next) {
    // inital recipe query base on query sent from GUI
    Recipe.find(query).populate('liquids.id').exec(function(err, recipes){
        if(err) next(err,null);
        else {
            // filter the returned recipes
            console.log("Beginning Filter Recipes:", recipes);
            var recipes_filtered = recipes.filter(function(recipe,recipeIndex,recipes){
                // filter all liquids of each returned reciped to make sure we have all required ingredients
                var liquids_filtered =  recipe.liquids.filter(function(liquid,liquidIndex,liquids){
                    var ids_filtered = station.connectedLiquids.filter(function(connLiquid){
                        if(connLiquid.id._id == liquid.id._id
                        || (connLiquid.id.type == liquid.id.type && liquid.id.subtype == "*Any")
                        || (connLiquid.id.type == liquid.id.type && connLiquid.id.subtype == liquid.id.subtype && liquid.id.brand == "*Any")
                        || !liquid.requirement) return true;
                        else return false;
                    });
                    // if an Id was found in the station, we have this liquid
                    if(ids_filtered.length > 0) return true;
                    else return false;
                });
                // if the filtered number of liquids that we have in the station matches the
                // number in the recipe, we have all that we need for the recipe
                if(liquids_filtered.length == recipe.liquids.length) return true;
                else return false;
            });
            console.log("End Filered Recipes:", recipes_filtered);
            next(err, recipes_filtered);
        }
    });
}

module.exports = router;
