var mongo = require('mongodb');
var express = require('express');
var router = express.Router();
var dbHelper = require('./dbHelper');
var station = require('./station');
var net = require('net');

// https://github.com/theturtle32/WebSocket-Node
var WebSocketServer = require('websocket').server;
var http = require('http');

// Setup a websocket server to receive commands from the Browser GUI client to send to the station
// and return status messages from the station controller back to the Browser GUI client
var server = http.createServer(function(request, respsonse) {
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

    var connection = request.accept('tob_command-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
            // send request to station API to get details
            var data = httpGet('/api/station/'+message.utf8Data.stationId);
            console.log(data);
        }
        else {
            console.log('Received Unacceptable Message');
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

// http://stackoverflow.com/a/4033310
function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

//Function to send a command to a station controller and receive status updates back
//These status updates are then returned to the Browser GUI through a websocket
function sendCommand(station_host, station_port, command, commandData) {
    var client = new net.Socket();
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
};

module.exports = router;
