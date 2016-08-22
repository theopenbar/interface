var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
    brand: String,
    description: String,
    amount: Number,
    barcode: String
});

var liquidSchema = new Schema({
    _id: {
      $oid: Schema.Types.ObjectId  
    },
    type: String,
    item: [itemSchema]
}, {collection: 'liquids'});

module.exports = mongoose.model('Liquid', liquidSchema);
