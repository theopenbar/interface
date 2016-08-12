var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
    brand: String,
    description: String,
    amount: Number,
    barcode: String
});

var liquorSchema = new Schema({
    _id: {
      $oid: Schema.Types.ObjectId  
    },
    type: String,
    item: [itemSchema]
}, {collection: 'liquor'});

module.exports = mongoose.model('Liquor', liquorSchema);
