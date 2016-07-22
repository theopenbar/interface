var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var dbHelper = require('./dbHelper');
var station = require('./station');
var net = require('net');

var client = new net.Socket();

// data comes from commander.service here
router.post('/', function(req, res) {
    // get IP address and port from station
    var db = req.db;
    var collection = db.get('stations');
    collection.findOne({ "_id": mongo.ObjectID(req.body.stationId) },function(err,station){
        if (err) throw err;
        // now send socket with all required information
        sendCommand(station.host, station.port, req.body.command, req.body.commandData);
    });

    res.json({"status":"sent"})
});


function sendCommand(station_host, station_port, command, commandData) {
    client.connect(station_port, station_host,
        function() {

            console.log('CONNECTED TO: ' + station_host + ':' + station_port);
            // Write a message to the socket as soon as the client is connected,
            // the server will receive it as message from the client
            if (commandData !== null) {
                client.write(command + ' ' + commandData);
                console.log('SENT: ' + command + ' ' + commandData);
            }
            else {
                client.write(command);
                console.log('SENT: ' + command);
            }
        }
    );
};

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function(data) {
    console.log('DATA: ' + data);
    // Close the client socket completely
    if (data == 'ERROR' || data == 'OK'){
         client.destroy();
         console.log('Closing Connection');
    }
});

// Add a 'close' event handler for the client socket
client.on('close', function() {
    console.log('Connection Closed');
});

module.exports = router;
