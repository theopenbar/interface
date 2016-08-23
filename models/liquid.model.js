var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var liquidSchema = new Schema({
    type: String,
    subtype: String,
    brand: String,
    description: String,
    amount: Number,
    barcode: String
}, {collection: 'liquids'});

module.exports = mongoose.model('Liquid', liquidSchema);
