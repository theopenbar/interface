var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dbConns = require('../db_connections');

var connectedLiquidSchema = new Schema({
    id: String,
    amount: Number,
    pressurized: Boolean,
    valve: Number
});

var onHandLiquidSchema = new Schema({
    id: String
});

var stationSchema = new Schema({
    name: String,
    host: String,
    port: Number,
    numValves: Number,
    connectedLiquids: [connectedLiquidSchema],
    onHandLiquids: [onHandLiquidSchema]
}, {collection: 'stations'});

module.exports = dbConns.old.model('Station', stationSchema);
