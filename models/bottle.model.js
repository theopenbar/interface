var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dbConns = require('../db_connections');

var bottleSchema = new Schema({
    liquid: {type: Schema.Types.ObjectId, ref:'Liquid'},
    amount: Number,
    barcode: Number
}, {collection: 'bottles'});

module.exports = dbConns.old.model('Bottle', bottleSchema);
