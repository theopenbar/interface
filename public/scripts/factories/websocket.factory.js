// https://github.com/AngularClass/angular-websocket
app.factory('WebSocket', function($websocket, $location) {
    // Open a WebSocket connection
    var host = $location.host();
    var port = $location.port();
    var protocol = $location.protocol();
    
    console.log(host + ':' + port);
    
    if (protocol === 'https') {
        var dataStream = $websocket('wss://' + host + ':8081' /*+ port*/ + '/api/commander','tob_command-protocol');
        console.log("Creating Secure WebSocket");
    }
    else {
        var dataStream = $websocket('ws://' + host + ':' + port + '/api/commander','tob_command-protocol');
        console.log("Creating Non-Secure WebSocket");
    }

    var messages = [];
    
    dataStream.onMessage(function(message) {
        messages.push(message.data);
        console.log(message.data);
    });
    dataStream.onOpen(function() {
        console.log("Established WebSocket Connection to Server")
    });
    var methods = {
        messages: messages,
        sendCommand: function(stationId, command, commandData) {
            dataStream.send(JSON.stringify({"stationId":stationId, "command":command, "commandData":commandData}));
        }
    };
    return methods;
});
