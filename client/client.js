#!/usr/bin/env node
var zmq = require('zmq');
var socket = zmq.socket('pub');

//Message encapsulation
var message = {
    //Message type (which you bind your events to)
    t: "example",

    //Payload
    p: {
	//Arbitrary data
    }
}

socket.bind("tcp://*:3000", function(err) {
    //Throw error
    if (err) {
	throw err;
    }

    setInterval(function() {
	var msg = JSON.stringify(message);
	socket.send("011TEST" + ' ' + msg);
	console.log("Sent " + msg.length + " bytes");
    }, 10);
});
