function Octopush(url) {

    this.events = {};
    this.channels = [];

    //Base setup
    var that = this;
    this.init = function() {
        that.socket = io.connect(url);
        that.socket.on("message", function(data) {
            if(typeof(that.events[data.e]) === "function")
                that.events[data.e](data.p);
        });

        //Internal states and error handling
        that.socket.on("error", function(data) {
            if(typeof(console) !== "undefined") {
                console.error(data);
            }
        });
        that.socket.on("auth", function(data) {
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
        that.socket.on("chans", function(data) {
            that.chans = data;
        });
    }

    //Include socketio
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.onload = this.init;
    script.type = 'text/javascript';
    script.src = url.replace(/\/$/, "") + "/socket.io/socket.io.js";
    head.appendChild(script);

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
