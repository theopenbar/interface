var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dbConns = require('../db_connections');

var liquidSchema = new Schema({
    type: String,
    subtype: String,
    brand: String,
    description: String,
    amount: Number,
    barcode: String
}, {collection: 'liquids'});

module.exports = dbConns.old.model('Liquid', liquidSchema);
