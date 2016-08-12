var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var liquor = new Schema({
    _id: {
      $oid: Schema.Types.ObjectId  
    },
    type: String,
    item: {
        type: Array,
        "default" : []
    }
}, {collection: 'liquor'});


module.exports = mongoose.model('Liquor', liquor);
