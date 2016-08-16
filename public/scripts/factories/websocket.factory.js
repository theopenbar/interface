// https://github.com/AngularClass/angular-websocket
app.factory('WebSocket', function($location) {
    // Open a WebSocket connection
    var host = $location.host();
    var protocol = $location.protocol();
    var port = $location.port();

    if (protocol === 'https') {
        console.log("Creating Secure WebSocket");
        var dataStream = io.connect('https://' + host + ':' + port);
    }
    else {
        console.log("Creating Non-Secure WebSocket");
        var dataStream = io.connect('http://' + host + ':' + port);
    }

    // http://django-websocket-redis.readthedocs.io/en/latest/heartbeats.html
    var heartbeat_interval = null, missed_heartbeats = 0;

    var pourInProgress = false;
    var pourComplete = false;
    var messages = [];

    dataStream.on('message', function(message) {
        // keep connection alive
        if (message === 'PONG') {
            // reset the counter for missed heartbeats
            missed_heartbeats = 0;
            return;
        }
        else if (message == "Received Command 01") {
            pourInProgress = true;
        }
        else if (message == "DONE" | message == "ERROR") {
            pourComplete = true;
        }
        else if (message == "BUSY") {
            pourComplete = true;
            alert("The station is currently busy pouring a drink. Please wait until that pour is complete to select another drink.");
        }
        else {
            messages.push(message);
        }
    });

    dataStream.on('connect', function() {
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

    dataStream.on('disconnect',function(close) {
        console.log("Close:", close);
    });

    dataStream.on('error',function(error) {
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
