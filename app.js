var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var users = require('./routes/users');

// create app using express
var app = express();

// create WebSocket
var expressWs = require('express-ws')(app);

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
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
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

// mongoose for passport user accounts
mongoose.connect('mongodb://localhost/passport_local_mongoose_express4');

// client-side routing
var routes = require('./routes/index');
app.use('/', routes);

// server-side routing for APIs
app.use('/api/user', require('./routes/user'));
app.use('/api/station', require('./routes/station'));
app.use('/api/station/ip', require('./routes/station_ip'));
app.use('/api/station/valves', require('./routes/station_valves'));
app.use('/api/station/ingredient', require('./routes/station_ingredient'));
app.use('/api/liquor', require('./routes/liquor'));
app.use('/api/drinks', require('./routes/drinks'));
app.use('/api/types', require('./routes/types'));
app.use('/api/commander', require('./routes/commander'));

// use this port
app.listen(8081);

module.exports = app;
