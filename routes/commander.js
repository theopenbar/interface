var mongo = require('mongodb');
var express = require('express');
var router = express.Router();
var net = require('net');

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
        //console.log(message);

        // keep connection alive
        if (message === 'PING') {
            ws.send('PONG');
        }
        else {
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
        }
    });
});

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
    // the station sends 'data' to this server to be passed to the GUI
    client.on('data', function(data) {
        // loop through raw data and parse it into coherent messages
        do {
            // length of message is in the header
            // message format is: '10 message'
            // the 3 character header is always a 2 digit number and a space
            // minus 3 because the header includes the first 3 digits
            var length = data.slice(0,2) - 3;
            //console.log("length:", length);

            // remainder of data string
            // remove the length header from the front
            var data = data.slice(3);
            //console.log("headless data:", data.toString());

            // just the good part of the remainder
            // slice it up as long as the length
            var message = (data.slice(0,length)).toString();
            //console.log("message:", message.toString());

            // special statuses
            if (message == 'DONE' || message == 'ERROR'){
                console.log("END: " + message);
                client.destroy();
            }
            // regular ol' data
            else {
               console.log('DATA: ' + message);
            }

            // send the message regardless
            guiConnection.send(message);

            // if any further messages, repeat the loop after removing the previous message
            data = data.slice(length);
            //console.log("final data:", data.toString());
        }
        while (data.length > 0);
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
