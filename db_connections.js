var mongoose = require('mongoose');
var dbConns = {
    /*pub: mongoose.createConnection('mongodb://localhost/publicTest',{
        user: null,
        pass: null
    }),
    priv: mongoose.createConnection('mongodb://localhost/privateTest',{
        user: null,
        pass: null
    }),*/
    old: mongoose.createConnection('mongodb://ds035004.mongolab.com:35004/heroku_ff1ms21p',{
        user: 'fakeuser2',
        pass: 'fakeuser2'
    })
};


module.exports = dbConns;
