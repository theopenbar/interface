var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
    brand: String,
    description: String,
    amount: Number,
    barcode: String
});

var liquidSchema = new Schema({
    type: String,
    item: [itemSchema]
}, {collection: 'liquids'});

module.exports = mongoose.model('Liquid', liquidSchema);
