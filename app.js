var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var db = require('./db_connection');

var app = express();
var expressWs = require('express-ws')(app);

var routes = require('./routes/index');
var user = require('./routes/user');
var station = require('./routes/station');
var station_ip = require('./routes/station_ip');
var station_valves = require('./routes/station_valves');
var station_ingredient = require('./routes/station_ingredient');
var drinks = require('./routes/drinks');
var types = require('./routes/types');
var commander = require('./routes/commander');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/:partials', routes);
app.use('/api/user', user);
app.use('/api/station', station);
app.use('/api/station/ip', station_ip);
app.use('/api/station/valves', station_valves);
app.use('/api/station/ingredient', station_ingredient);
app.use('/api/drinks', drinks);
app.use('/api/types', types);
app.use('/api/commander', commander);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(8081);

module.exports = app;
