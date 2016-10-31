var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dbConns = require('../db_connections');

var liquidSchema = new Schema({
    id: {type: Schema.Types.ObjectId, ref:'Liquid'},
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

module.exports = dbConns.old.model('Recipe', recipeSchema);
