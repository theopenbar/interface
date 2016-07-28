var mongo = require('mongodb');
var express = require('express');
var router = express.Router();
//var dbHelper = require('./dbHelper');
//var station = require('./station');
var net = require('net');
//var db = require('../db_connection');
// https://github.com/theturtle32/WebSocket-Node
//var WebSocketServer = require('websocket').server;
//var http = require('http');
//var app = require('../app');


// Setup a websocket server to receive commands from the Browser GUI client to send to the station
// controller and return status messages from the station controller back to the Browser GUI client

//var server = http.createServer(app);

/*
server.listen(8081, function() {
    console.log((new Date()) + ' Server is listening on port 8081');
});
*/
/*
wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false,
    path: "/api/commander"
});

// Function to check if the origin is valid. It should be this Server
function originIsAllowed(origin) {
    console.log('Origin: ' + origin);
  // put logic here to detect whether the specified origin is allowed.
  return true;
}
*/

router.get('/', function(req, res, next){
  console.log('get route');
  res.end();
});

router.ws('/', function(ws, req) {
    if (ws.protocol !== 'tob_command-protocol') {
          console.log((new Date()) + ' Rejected WebSocket Connection From: ' + req.ip);
          return;
    }
    ws.on('message', function(message) {
          console.log(message);
          try {
              var command = JSON.parse(message);
              console.log('Received Command: ' + command.command);
              // Get the provided station's details from the database (need host and port for station)
              var db = req.db;
              var collection = db.get('stations');
              collection.findOne({ "_id": mongo.ObjectID(command.stationId) },function(err,station){
                  if (err) throw err;
                  if (station !== null) {
                      sendCommand(ws, station.host, station.port, command.command, command.commandData);
                  }
              });
          }
          catch(e) {
              console.log(e);
          }
    });
});

/*
// https://github.com/theturtle32/WebSocket-Node/blob/master/example/whiteboard/whiteboard.js
wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    var connection = request.accept('tob_command-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            try {
                var command = JSON.parse(message.utf8Data);
                console.log('Received Command: ' + command);
                // Get the provided station's details from the database (need host and port for station)
                var collection = db.get('stations');
                collection.findOne({ "_id": mongo.ObjectID(command.stationId) },function(err,station){
                    if (err) throw err;
                    if (station !== null) {
                        sendCommand(connection, station.host, station.port, command.command, command.commandData)
                    }
                });
            }
            catch(e) {
                console.log(e)
            }
        }
        else {
            console.log('Received Unacceptable Message');
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});
*/


// Function to send a command to a station controller and receive status updates back
// These status updates are then returned to the Browser GUI through a passed websocket connection
function sendCommand(guiConnection, station_host, station_port, command, commandData) {
    var client = new net.Socket();
    client.connect(station_port, station_host,
        function() {
            console.log('CONNECTED TO STATION: ' + station_host + ':' + station_port);
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
    // Add a 'data' event handler for the client socket
    // data is what the station sent to this server to be passed to the GUI
    client.on('data', function(data) {
        // Close the client socket completely
        if (data == '08 ERROR' || data == '07 DONE'){
            console.log("END: " + data);
            client.destroy();
            console.log('Closing Station Socket Connection');
        }
        else {
            var length = +data.slice(0,2) - 3; //length of message is the byte length -3 header bytes
            var remainder = data.slice(3);        //remainder of data string (should be 1 message)
            var message = null;
            do {
                message = (remainder.slice(0,length)).toString();
                console.log('DATA: ' + message);
                guiConnection.send(message); //send the message
                remainder = remainder.slice(length); // if any further messages, repeat the loop
            }
            while (remainder.length > 0);
        }
    });
    // Add a 'close' event handler for the client socket
    client.on('close', function() {
        console.log('Station Socket Connection Closed');
    });
    // Add a 'error' event handler for the client socket
    client.on('error', function() {
        guiConnection.send("Station Controller Socket Error");
        console.log('Station Socket Communication Error');
        // calls 'close' event afterwards
    });
};

module.exports = router;
