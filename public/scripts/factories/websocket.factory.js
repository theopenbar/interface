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

    var pourInProgress = false;
    var pourComplete = false;
    var messages = [];
    
    dataStream.onMessage(function(message) {
        console.log("FACTORY:", message.data);

        if (message.data == "Received Command 01") {
            pourInProgress = true;
        }
        else if (message.data == "DONE" | message.data == "ERROR") {
            pourComplete = true;
        }
        else {
            messages.push(message.data);
        }
    });

    dataStream.onOpen(function() {
        console.log("Established WebSocket Connection to Server")
    });

    var methods = {
        messages: messages,
        // true while pouring
        pourInProgress: function() {
            return pourInProgress;
        },
        // true when complete
        pourComplete: function() {
            return pourComplete;
        },
        // used to reset variables after pour is complete
        dismissPourStatus: function() {
            pourInProgress = false;
            pourComplete = false;
        },
        sendCommand: function(host, port, command, commandData) {
            dataStream.send(JSON.stringify({"host":host, "port":port, "command":command, "commandData":commandData}));
        }
    };
    return methods;
});
