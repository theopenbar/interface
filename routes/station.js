var express = require('express');
var router = express.Router();
var Station = require('../models/station.model');
var Liquid = require('../models/liquid.model');
var Recipe = require('../models/recipe.model');

router.get('/:id', function(req, res) {
    Station.findById(req.params.id, function (err, station) {
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
            station.modified = new Date();
            delete req.body._id;
            station.update(req.body, function(err, status) {
                if (err) return res.status(500).json({err: err});
                Station.findById(req.params.id, function(err, updated_station) {
                    if (err) return res.status(500).json({err: err});
                    res.json(updated_station);
                });
            });
        }
    });
});

router.get('/recipes/:id', function(req, res) {
    Station.findById(req.params.id, function (err, station) {
        if (err) return (err);
        // first get all liquids on station
        getStationLiquids(station, function(err, liquids){
            if (err) return res.status(500).json({err: err});
            // second get recipes matching station's liquids
            getMatchingRecipes(liquids, function(err, recipes){
                if (err) return res.status(500).json({err: err});
                res.json(recipes);
            });
        });
    });
});

function getStationLiquids(station, next) {
    // set an array of all the stations liquid ids to search for
    var ids = [];
    for (i=0; i<station.connectedLiquids.length; i++)
        ids[i] = station.connectedLiquids[i].id;
    // get all the liquids with an id in the ids array
    var query = {"_id":{$in:ids}};
    Liquid.find(query, function(err, liquids){
        next(err, liquids);
    });
}

function getMatchingRecipes(liquids, next) {
    // set an array of all the station's liquid ids to search for recipes with
    var ids = [];
    for (i=0; i<liquids.length; i++)
        ids[i] = liquids[i]._id;

    // query for all recipes that match at least one of the ids
    var query = {"liquids":{$elemMatch:{"id":{$in:ids}}}};

    Recipe.find(query, function(err, recipes){
        if(err) return (err);

        // filter the returned recipes
        var recipes_filtered = recipes.filter(function(recipe,recipeIndex,recipes){
            // filter all liquids of each returned reciped to make sure we have all required ingredients
            var liquids_filtered =  recipe.liquids.filter(function(liquid,liquidIndex,liquids){
                var ids_filtered = ids.filter(function(id){
                    return (id == liquid.id || !(liquid.requirement));
                });
                // if an Id was found in the station, we have this liquid
                if(ids_filtered.length > 0) return true;
                else return false;
            });
            // if the number of liquids that we have in the station matches the
            // number in the recipe, we have all that we need for the recipe
            if(liquids_filtered.length == recipe.liquids.length) return true;
            else return false;
        });

        next(err, recipes_filtered);
    });
}

module.exports = router;
