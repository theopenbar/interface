var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var dbHelper = require('./dbHelper');
var station = require('./station');
var net = require('net');

// https://github.com/theturtle32/WebSocket-Node
var WebSocketServer = require('websocket').server;
var https = require('https');

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
    // Close the client socket completely
    if (data == 'ERROR' || data == 'OK'){
        console.log("END: " + data);
         client.destroy();
         console.log('Closing Connection');
    }
    else {
        console.log('DATA: ' + data);
    }
});

// Add a 'close' event handler for the client socket
client.on('close', function() {
    console.log('Connection Closed');
});

// Add a 'error' event handler for the client socket
client.on('error', function() {
    console.log('Error');
    // calls 'close' event afterwards
});



// https://github.com/theturtle32/WebSocket-Node
// ***** SERVER EXAMPLE *****
var server = https.createServer(function(request, respsonse) {
    console.log((new Date()) + ' Recieved request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8081, function() {
    console.log((new Date()) + ' Server is listening on port 8081');
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
    console.log('Origin: ' + origin);
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

module.exports = router;
