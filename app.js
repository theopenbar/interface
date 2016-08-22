var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// create app using express
var app = express();
var server = module.exports = require('http').createServer(app);

// setup socket.io server
var io = require('socket.io').listen(server);

// use HTML view engine
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// Make our db accessible to our router
var db = require('./db_connection');
app.use(function(req,res,next){
    req.db = db;
    next();
});

// other things required for app
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
  secret: 'da big question',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// schema for mongoose
var Liquor = require('./models/liquor.model');

// mongoose for passport user accounts
mongoose.connect('mongodb://fakeuser2:fakeuser2@ds035004.mongolab.com:35004/heroku_ff1ms21p');

// client-side routing
var routes = require('./routes/index');
app.use('/', routes);
// allow GET requests to specific $state from address bar
app.use('/:partials', routes);

// server-side routing for APIs
app.use('/api/account', require('./routes/account'));
app.use('/api/user', require('./routes/user'));
app.use('/api/station', require('./routes/station'));
app.use('/api/liquor', require('./routes/liquor'));
app.use('/api/recipe', require('./routes/recipe'));
app.use('/api/types', require('./routes/types'));
//user commander to handle socket.io connections
io.sockets.on('connection', require('./routes/commander'));
