var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var dbHelper = require('./dbHelper');
var net = require('net');

var HOST = 'thorwat.dlinkddns.com';
var PORT = 12345;

var client = new net.Socket();

function sendCommand(command, commandData) {
    client.connect(PORT, HOST, function() {

    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
    if (commandData !== null) {
        client.write(command + ' ' + commandData);
        console.log('SENT: ' + command + ' ' + commandData);
    }
    else {
        client.write(command);
        console.log('SENT: ' + command);
    }

})};

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

//sendCommand('01','56b50d52e4b0762325b1b1cf');

router.post('/', function(req, res) {
    var command = req.body.command;
    var commandData = req.body.commandData;

    sendCommand(command,commandData);
    res.json({"status":"sent"})
});


module.exports = router;
