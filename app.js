var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');

// create app using express
var app = express();

// create WebSocket
var expressWs = require('express-ws')(app);

// use HTML view engine
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = require('./db_connection');
    next();
});

// other things required for app
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// client-side routing
var routes = require('./routes/index');
app.use('/', routes);
app.use('/:partials', routes);

// server-side routing for APIs
app.use('/api/user', require('./routes/user'));
app.use('/api/station', require('./routes/station'));
app.use('/api/station/ip', require('./routes/station_ip'));
app.use('/api/station/valves', require('./routes/station_valves'));
app.use('/api/station/ingredient', require('./routes/station_ingredient'));
app.use('/api/drinks', require('./routes/drinks'));
app.use('/api/types', require('./routes/types'));
app.use('/api/commander', require('./routes/commander'));

// use this port
app.listen(8081);

module.exports = app;
