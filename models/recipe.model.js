var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dbConns = require('../db_connections');

var drinkSchema = new Schema({
    type: String,
    brand: String,
    description: String,
    amount: Number,
    requirement: Boolean
});

var garnishSchema = new Schema({
    name: String,
    amount: String
});

var recipeSchema = new Schema({
    name: String,
    drinks: [drinkSchema],
    garnishes: [garnishSchema]
}, {collection: 'recipes'});

module.exports = dbConns.old.model('Recipe', recipeSchema);
