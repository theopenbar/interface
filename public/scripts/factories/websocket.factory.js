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

    // http://django-websocket-redis.readthedocs.io/en/latest/heartbeats.html
    var heartbeat_interval = null, missed_heartbeats = 0;

    var pourInProgress = false;
    var pourComplete = false;
    var messages = [];
    
    dataStream.onMessage(function(message) {
        //console.log("FACTORY:", message.data);

        //
        if (message.data === 'PONG') {
            // reset the counter for missed heartbeats
            missed_heartbeats = 0;
            return;
        }
        else if (message.data == "Received Command 01") {
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
        console.log("Established WebSocket Connection to Server");

        // keep connection alive
        if (heartbeat_interval === null) {
            missed_heartbeats = 0;
            heartbeat_interval = setInterval(function() {
                try {
                    missed_heartbeats++;
                    if (missed_heartbeats >= 3)
                        throw new Error("Too many missed heartbeats.");
                    dataStream.send('PING');
                } catch(e) {
                    clearInterval(heartbeat_interval);
                    heartbeat_interval = null;
                    console.warn("Closing connection. Reason: " + e.message);
                    dataStream.close();
                }
            }, 5000);
        }
    });

    dataStream.onClose(function(close) {
        console.log("Close:", close);
    });

    dataStream.onError(function(error) {
        console.log("Error:", error);
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
        sendCommand: function(stationId, command, commandData) {
            dataStream.send(JSON.stringify({"stationId":stationId, "command":command, "commandData":commandData}));
        }
    };
    return methods;
});
