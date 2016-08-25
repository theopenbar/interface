var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dbConns = require('../db_connections');

var Session = new Schema({
    myParam1: String
});


module.exports = dbConns.priv.model('MySession', Session);
