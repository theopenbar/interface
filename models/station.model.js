var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dbConns = require('../db_connections');

var configuredSchema = new Schema({
    liquid: Schema.Types.ObjectId,
    valve: Number, 
    amount: Number, 
    pressurized: Boolean
});

var additionalSchema = new Schema({
    liquid: Schema.Types.ObjectId
});

var stationSchema = new Schema({
    host: String,
    port: Number,
    num_valves: Number,
    ingredients: {
        configured: [configuredSchema],
        additional: [additionalSchema]
    }
}, {collection: 'stations'});

module.exports = dbConns.old.model('Station', stationSchema);
