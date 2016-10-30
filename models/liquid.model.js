var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dbConns = require('../db_connections');

var liquidSchema = new Schema({
    type: String,
    subtype: String,
    brand: String,
    description: String
}, {collection: 'liquids'});

module.exports = dbConns.pub.model('Liquid', liquidSchema);
