app.factory('WebSocket', function($location, $rootScope) {
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

    var pourInProgress = false;
    var pourComplete = false;
    var messages = [];

    dataStream.on('message', function(message) {
        $rootScope.$apply(function() {
            // keep connection alive
            if (message == "Received Command 01") {
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
        })
    });

    dataStream.on('connect', function() {
        console.log("Established WebSocket Connection to Server");
    });

    dataStream.on('disconnect', function(close) {
        console.log("Close:", close);
    });

    dataStream.on('error', function(error) {
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
