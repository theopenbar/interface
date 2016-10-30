var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dbConns = require('../db_connections');

var subtypeSchema = new Schema({
    subtype: String
})

var typeSchema = new Schema({
    type: String,
    subtypes: [subtypeSchema]
}, {collection: 'types'});

module.exports = dbConns.pub.model('Type', typeSchema);
