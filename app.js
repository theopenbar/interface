var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var dbConns = require('./db_connections');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

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
app.use(session({
  secret: 'da big question',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
      mongooseConnection: dbConns.old,
      ttl: 5*60*60
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// passport config
var Account = require('./models/account.model');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// client-side routing
var routes = require('./routes/index');
app.use('/', routes);
// allow GET requests to specific $state from address bar
app.use('/:partials', routes);

// server-side routing for APIs
app.use('/api/account', require('./routes/account'));
app.use('/api/user', require('./routes/user'));
app.use('/api/station', require('./routes/station'));
app.use('/api/type', require('./routes/type'));
app.use('/api/liquid', require('./routes/liquid'));
app.use('/api/recipe', require('./routes/recipe'));
//use commander to handle socket.io connections
io.sockets.on('connection', require('./routes/commander'));
