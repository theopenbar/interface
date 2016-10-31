var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dbConns = require('../db_connections');

var connectedLiquidSchema = new Schema({
    id: {type: Schema.Types.ObjectId, ref:'Liquid'},
    amount: Number,
    pressurized: Boolean,
    valve: Number
});

var stationSchema = new Schema({
    name: String,
    host: String,
    port: Number,
    numValves: Number,
    connectedLiquids: [connectedLiquidSchema],
    onHandLiquids: [{type: Schema.Types.ObjectId, ref: 'Liquid'}]
}, {collection: 'stations'});

module.exports = dbConns.old.model('Station', stationSchema);
