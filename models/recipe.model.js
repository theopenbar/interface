var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

module.exports = mongoose.model('Recipe', recipeSchema);
