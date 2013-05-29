function Octopush(url) {

    //Base setup
    var that = this;
    this.events = {},
    this.channels = [],
    this.socket = io.connect(url);
    this.socket.on("message", function(data) {
	if(typeof(that.events[data.t]) === "function")
	    that.events[data.t](data.p);
    });

    //Internal states and error handling
    this.socket.on("error", function(data) {
	if(typeof(console) !== "undefined") {
	    console.error(data);
	}
    });
    this.socket.on("auth", function(data) {
	if(typeof(console) !== "undefined") {
	    switch(data) {

	    case 0:
		console.log("Authenticated");
		break;
		
	    case 1:
		console.error("Authentication failed");
		break;

	    case 2:
		console.error("Server not configured for auth");
		break;

	    default:
		console.error("Unknown error code for auth: " + data);

	    }
	}
    });
    this.socket.on("chans", function(data) {
	that.chans = data;
    });

    //User functions
    this.on = function(event, callback) { 
	that.events[event] = callback;
    }
    this.join = function(channel) {
	var obj = {chan: channel}
	if(channel[0] === "!")
	    obj.cookie = document.cookie
	that.socket.emit("join", {chan: channel});
    }
    this.part = function(channel) {
	that.socket.emit("part", channel);
    }
    this.auth = function() {
	that.socket.emit("auth", document.cookie);
    }

}

var Push = new Octopush("http://localhost:3001");
Push.on("example", function(data) {
    console.log(data);
});
