var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dbConns = require('../db_connections');

var bottleSchema = new Schema({
    amount: Number,
    barcode: String,
    liquid: {type: Schema.Types.ObjectId, ref: 'Liquid'}
}, {collection: 'bottles'});

module.exports = dbConns.old.model('Bottle', bottleSchema);
