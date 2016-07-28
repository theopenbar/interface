// for mongodb
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongodb://fakeuser2:fakeuser2@ds035004.mongolab.com:35004/heroku_ff1ms21p');

module.exports = db;