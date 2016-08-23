var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
    brand: String,
    description: String,
    amount: Number,
    barcode: String
});

var subtypeSchema = new Schema({
    subtype: String,
    items: [itemSchema]
})

var liquidSchema = new Schema({
    type: String,
    subtypes: [subtypeSchema]
}, {collection: 'liquids'});

module.exports = mongoose.model('Liquid', liquidSchema);
