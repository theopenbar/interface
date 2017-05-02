var mongoose = require('mongoose');
var dbConns = {
    pubLocal: mongoose.createConnection('mongodb://localhost/publicTest',{
        user: null,
        pass: null
    }),
    privLocal: mongoose.createConnection('mongodb://localhost/privateTest',{
        user: null,
        pass: null
    }),
    pubCloud: mongoose.createConnection('mongodb://ds035004.mongolab.com:35004/heroku_ff1ms21p',{
        user: 'fakeuser2',
        pass: 'fakeuser2'
    }),
    privCloud: mongoose.createConnection('mongodb://ds035004.mongolab.com:35004/heroku_ff1ms21p',{
        user: 'fakeuser2',
        pass: 'fakeuser2'
    })
};


module.exports = dbConns;
