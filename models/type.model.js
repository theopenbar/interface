var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var subtypeSchema = new Schema({
    subtype: String
})

var typeSchema = new Schema({
    type: String,
    subtypes: [subtypeSchema]
}, {collection: 'types'});

module.exports = mongoose.model('Type', typeSchema);
