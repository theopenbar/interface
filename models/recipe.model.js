var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dbConns = require('../db_connections');

var liquidSchema = new Schema({
    id: String,
    amount: Number,
    requirement: Boolean
});

var garnishSchema = new Schema({
    name: String,
    amount: String
});

var recipeSchema = new Schema({
    name: String,
    liquids: [liquidSchema],
    garnishes: [garnishSchema]
}, {collection: 'recipes'});

module.exports = dbConns.pub.model('Recipe', recipeSchema);
