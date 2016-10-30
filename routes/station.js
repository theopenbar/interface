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
    var query = {"liquids":{$elemMatch:{"id":{$in:ids}}}};
    Recipe.find(query, function(err, recipes){
        var recipes_filtered = [];

        // for each recipe returned
        for(i=0;i<recipes.length;i++)
        {
            // for each liquid in a recipe
            for(j=0;j<recipes[i].liquids.length;j++){
                // if the liquid id is not found in the stations liquids
                // and it is required
                if(!ids.find(function(element,index,array){
                    return (element == recipes[i].liquids[j].id
                        || !(recipes[i].liquids[j].requirement));
                })) {
                    // break out of the loop for this recipe's liquids
                    break;
                }
                else if(j==recipes[i].liquids.length-1) {
                    //else if all liquids have been found, add this recipe
                    recipes_filtered.push(recipes[i]);
                }
            }
        }
        next(err, recipes_filtered);
    });
}

// define find function for arrays if it isn't already
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, "find", {
    value: function(predicate) {
     'use strict';
     if (this == null) {
       throw new TypeError('Array.prototype.find called on null or undefined');
     }
     if (typeof predicate !== 'function') {
       throw new TypeError('predicate must be a function');
     }
     var list = Object(this);
     var length = list.length >>> 0;
     var thisArg = arguments[1];
     var value;

     for (var i = 0; i < length; i++) {
       value = list[i];
       if (predicate.call(thisArg, value, i, list)) {
         return value;
       }
     }
     return undefined;
    }
  });
}

module.exports = router;
